export abstract class Mapper {
    public abstract toDomain(raw: any): any;
    
    public toDao(obj: any): string {
        return JSON.stringify(obj)
    }

}