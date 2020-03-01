let express = require("./node_modules/express");
let path = require("path");
let cookieParser = require("./node_modules/cookie-parser");
let logger = require("./node_modules/morgan");
let bearerToken = require("./node_modules/express-bearer-token");

let indexService = require("./services/index");

let indexRouter = require("./routes/index");
let aboutRouter = require("./routes/about");
let usersRouter = require("./routes/users/users");
let authRouter = require("./routes/auth/auth");
let servicesRouter = require("./routes/services/services");
let servicesActionsRouter = require("./routes/services/actions/actions");
let servicesReactionsRouter = require("./routes/services/reactions/reactions");
let usersServicesRouter = require("./routes/users/services/services");
let usersAreasRouter = require("./routes/users/areas/areas");

let app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
    bearerToken({
        bodyKey: "no_access_token",
        queryKey: "no_access_token"
    })
);

app.use("/", indexRouter);
app.use("/", aboutRouter);
app.use("/", usersRouter);
app.use("/", authRouter);
app.use("/", servicesRouter);
app.use("/", servicesActionsRouter);
app.use("/", servicesReactionsRouter);
app.use("/", usersServicesRouter);
app.use("/", usersAreasRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send("error");
});

// Start Trigger-Reaction Process
app.listen(4000, function() {
    indexService.run();
});

module.exports = app;
