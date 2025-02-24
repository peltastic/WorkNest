"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailHandler = void 0;
const mailgun_js_1 = __importDefault(require("mailgun-js"));
const API_KEY = "b8b6cf8b387887d243fb748a110a8f5e-ac3d5f74-c3e4afff";
const DOMAIN = "sandbox81c16fe08d6941a6a6ab99b8c9616a32.mailgun.org";
const mg = (0, mailgun_js_1.default)({ apiKey: API_KEY, domain: DOMAIN });
const sendMail = (senderEmail, receiverEmail, emailSubject, emailBody) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        from: senderEmail,
        to: receiverEmail,
        subject: emailSubject,
        html: emailBody,
    };
    try {
        const response = yield mg.messages().send(data);
        console.log("Email sent:", response);
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
});
// // Example usage
// const senderEmail = "onosogapelumi@gmail.com";
// const receiverEmail = "receiver@gmail.com";
// const emailSubject = "Mailgun Demo";
// const emailBody = "Greetings from GeeksforGeeks";
const sendEmailHandler = (receiver, subject, body) => {
    sendMail("onasogapelumi@gmail.com", receiver, subject, body);
};
exports.sendEmailHandler = sendEmailHandler;
