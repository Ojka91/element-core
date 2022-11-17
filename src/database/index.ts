import mongoose from 'mongoose'


class Database {
   static connect(){
        mongoose.connect(process.env.MONGO_URL || '', { dbName: process.env.DATABASE, useNewUrlParser: true, useUnifiedTopology: true }, () => {
            if(mongoose.connection.readyState === 1) {
              console.error('Database connected successfuly');
            } else {
              console.log('Could not connect to database');
            }
          });
    }
}

export default Database;