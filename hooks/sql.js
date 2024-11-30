import SQLite from 'react-native-sqlite-storage';


const database_name = 'ChatHistory.db';
const database_version = '1.0';
const database_displayname = 'Chat History Database';
const database_size = 500000;

SQLite.DEBUG(true);
SQLite.enablePromise(true);

let dbInstance = null;

export const getDatabase = async () => {
  try {
    if (!dbInstance) {
      dbInstance = await SQLite.openDatabase(
        database_name,
        database_version,
        database_displayname,
        database_size
      );

      await dbInstance.transaction((tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender TEXT NOT NULL,
            message TEXT NOT NULL
          );`,
          [],
          () => console.log("Table 'chat_history' ensured."),
          (_, error) => {
            console.error("Failed to create table:", error);
            throw error;
          }
        );
      });
    }
    return dbInstance;
  } catch (error) {
    console.error("Failed to open database:", error);
    throw error;
  }
};

export const saveMessage = async (sender, message) => {
  try {
    if (!sender || !message) {
      throw new Error("Invalid sender or message. Both values are required.");
    }
    const db = await getDatabase();

    await db.transaction(
      async (tx) => {
        console.log("Starting transaction...");
        await tx.executeSql(
          `INSERT INTO chat_history (sender, message) VALUES (?, ?)`,
          [String(sender), String(message)],
          (_, result) => {
            console.log("Insert successful:", result);
          },
          (_, error) => {
            console.error("SQL Error:", error);
            throw error;
          }
        );
      },
      (transactionError) => {
        console.error("Transaction Error:", transactionError);
        throw transactionError;
      }
    );

    console.log("Message saved successfully.");
  } catch (error) {
    console.error("Failed to save message:", error);
  }
};

export const getChatHistory = async () => {
  try {
    const db = await getDatabase();
    const chatHistory = [];

    await db.transaction(async (tx) => {
      const [results] = await tx.executeSql(`SELECT * FROM chat_history`);
      for (let i = 0; i < results.rows.length; i++) {
        chatHistory.push(results.rows.item(i));
      }
    });

    console.log("Fetched chat history:", chatHistory);
    return chatHistory;
  } catch (error) {
    console.error("Failed to fetch chat history:", error);
    return [];
  }
};

export const clearChatHistory = async () => {
  try {
    const db = await getDatabase();
    await db.transaction(async (tx) => {
      await tx.executeSql(`DELETE FROM chat_history`);
      console.log("Chat history cleared.");
    });
  } catch (error) {
    console.error("Failed to clear chat history:", error);
  }
};

export const deleteDatabase = async () => {
  try {
    await SQLite.deleteDatabase({
      name: database_name,
      location: 'default',
    });
    console.log("Database deleted successfully.");
    dbInstance = null;
  } catch (error) {
    console.error("Failed to delete database:", error);
  }
};
