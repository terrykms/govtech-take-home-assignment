const { app, setupApp } = require("./app");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await setupApp();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error initializing database:", err);
    process.exit(1);
  }
};

startServer();
