import GameStart from "@/app/use-cases/room/GameStart";
import SetTurnTimer from "@/app/use-cases/timer/SetTurnTimer";
import { DomainEventEmitter } from "@/domain/service/DomainEventEmitter";
import DomainEvent from "@/domain/service/domainEvents/DomainEvent";
import TimerService from "@/domain/service/timer/TimerService";
import { Server, Socket } from "socket.io";
import { ChatService } from "../service/chat/ChatService";
import { CancelQueueService } from "../service/queue/CancelQueue";
import { OnQueueService } from "../service/queue/OnQueue";
import { DrawElementsService } from "../service/socket/DrawElements";
import { EndTurnService } from "../service/socket/EndTurn";
import { EventHandlerService } from "../service/socket/EventHandler";
import { ForceGameUpdateService } from "../service/socket/ForceGameUpdate";
import { ForfeitService } from "../service/socket/Forfeit";
import { GameUpdateService } from "../service/socket/GameUpdate";
import { JoinGameService } from "../service/socket/JoinGame";
import { MoveSageService } from "../service/socket/MoveSage";
import { PlaceElementService } from "../service/socket/PlaceElement";
import { SocketConnectionService } from "../service/socket/SocketConnection";
import { SocketDisconnectService } from "../service/socket/SocketDisconnect";
import { QueueController } from "./queue_controller";
import {
    ChatClientToServer,
    ClientToServerEvents,
    DrawElementsData,
    EndTurnData,
    ForfeitData,
    InterServerEvents,
    JoinGameData,
    MoveSageData,
    PlaceElementData,
    Queue,
    ServerToClientEvents,
    SocketData,
} from "./socketUtils";

/**
 * This class is reponsible to mantain socket connection and logic between players and server when game begins
 */
class SocketController {
    private io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;

    private roomsIds: string[] = [];

    constructor(
        server: any,
    private timerService: TimerService,
    private eventEmitter: DomainEventEmitter
    ) {
        this.io = new Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >(server);
    }
    public init() {
        const queueController = new QueueController();
        const setTurnTimerUseCase = new SetTurnTimer(
            this.timerService,
            this.eventEmitter
        );

        this.io.on(
            "connection",
            async (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
                const gameUpdateService = new GameUpdateService(
                    this.io,
                    setTurnTimerUseCase
                );
                const socketConnectionService = new SocketConnectionService(
                    this.io,
                    socket
                );

                const response = await socketConnectionService.execute();
                if (response != null) {
                    // Reconnection success
                    gameUpdateService.execute(response.room_uuid, response);
                }

                /**
         * onQueue: Clients that want to play a game search for a game emitting to this event with the type of queue they join (2, 3 or 4 players)
         * 1. When client enters on onQueue it joins queue room for 2, 3 or 4 players.
         * 2. We should check if there are enough players on queue room to start a game
         * 2.1 If so, we should make those players join new room (roomId), and kick them from queue room
         */
                socket.on("onQueue", async (queue: Queue) => {
                    const onQueueService = new OnQueueService(
                        this.io,
                        socket,
                        queueController
                    );
                    await onQueueService.execute(this.roomsIds, queue);
                });

                /**
         * User in queue cancels being in queue
         */
                socket.on("cancelQueue", async (data: Queue) => {
                    const cancelQueueService = new CancelQueueService(
                        socket,
                        queueController
                    );
                    await cancelQueueService.execute(data, socket.id);
                });

                /**
         * joinGame: A client should emit to this event after joining 'onQueue' and having received roomId for them to join
         * 1. Client should join game/roomId socket and as user on the game room
         * 2. We check if all players have joined or we are still waiting for someone to join
         * 2.1 If so, we start the game
         */
                socket.on("joinGame", async (data: JoinGameData) => {
                    const gameStartUseCase = new GameStart();
                    const joinGameService = new JoinGameService(
                        socket,
                        setTurnTimerUseCase,
                        gameStartUseCase
                    );
                    const response = await joinGameService.execute(data);
                    if (response != null) {
                        // Subscribe to domain events
                        const eventHandler = (event: DomainEvent) => {
                            const eventHandlerService = new EventHandlerService(
                                gameUpdateService,
                                setTurnTimerUseCase
                            );
                            eventHandlerService.execute(event);
                        };
                        this.eventEmitter.addListener(eventHandler);
                        gameUpdateService.execute(response.room_uuid, response);
                    }
                });

                /**
         * endTurn: Client which turn is playing should emit to this event with all the changes in the board
         */
                socket.on("endTurn", async (data: EndTurnData) => {
                    const endTurnService = new EndTurnService(
                        setTurnTimerUseCase
                    );
                    const response = await endTurnService.execute(data);
                    gameUpdateService.execute(response.room_uuid, response);
                });

                /**
         * drawElements: Client which turn is playing should draw elements
         */
                socket.on("drawElements", async (data: DrawElementsData) => {
                    const drawElementsService = new DrawElementsService(socket, setTurnTimerUseCase);
                    const response = await drawElementsService.execute(data);
                    if (response != null) {
                        gameUpdateService.execute(response.room_uuid, response);
                    }
                });

                /**
         * placeElement: Client which turn is playing should place element
         */
                socket.on("placeElement", async (data: PlaceElementData) => {
                    const placeElementService = new PlaceElementService(socket, setTurnTimerUseCase);
                    const response = await placeElementService.execute(data);
                    if (response != null) {
                        gameUpdateService.execute(response.room_uuid, response);
                    }
                });

                /**
         * moveSage: Client which turn is playing should move sage
         */
                socket.on("moveSage", async (data: MoveSageData) => {
                    const moveSageService = new MoveSageService(socket, setTurnTimerUseCase);
                    const response = await moveSageService.execute(data);
                    if (response != null) {
                        gameUpdateService.execute(response.room_uuid, response);
                    }
                });

                /**
         * forfeit: A player surrender
         */
                socket.on("forfeit", async (data: ForfeitData) => {
                    const forfeitService = new ForfeitService(
                        socket,
                        setTurnTimerUseCase
                    );
                    const response = await forfeitService.execute(data);
                    if (response != null) {
                        gameUpdateService.execute(response.room_uuid, response);
                    }
                });

                /**
         * When player disconnect we only have socket id.
         * We loop through roomId array and get userLists for every room
         * When a user match the socketId it's disconnected we force that player as a loser and emit response
         */
                socket.on("disconnect", async () => {
                    const disconnectService = new SocketDisconnectService(
                        this.io,
                        socket,
                        queueController
                    );
                    await disconnectService.execute();
                });

                /**
         * Chat event enables the possibility to have a chat with other players in your game.
         * The event receives the roomID and the message a player wants to send to the chat, and broadcast it
         * to all players within the room
         */
                socket.on("chat", async (data: ChatClientToServer) => {
                    const chatService = new ChatService(this.io, socket);
                    await chatService.execute(data);
                });

                socket.on("forceGameUpdate", async () => {
                    const forceGameUpdateService = new ForceGameUpdateService(socket);
                    const response = await forceGameUpdateService.execute();
                    gameUpdateService.execute(response.room_uuid, response);
                });
            }
        );
    }
}

export default SocketController;
