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
exports.generateResponse = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// GoogleGenerativeAI required config
const configuration = new generative_ai_1.GoogleGenerativeAI(process.env.API_KEY);
// Model Initialization
const modelId = "gemini-2.0-flash-lite";
const model = configuration.getGenerativeModel({ model: modelId });
// These arrays maintain the history of the conversation
const conversationContext = [];
const currentMessages = [];
// Controller function to handle chat conversation
const generateResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { prompt } = req.body;
        // Restore the previous context
        for (const [inputText, responseText] of conversationContext) {
            currentMessages.push({ role: "user", parts: inputText });
            currentMessages.push({ role: "model", parts: responseText });
        }
        const chat = model.startChat({
            history: currentMessages,
            generationConfig: {
                maxOutputTokens: 100,
            },
        });
        const result = yield chat.sendMessage(prompt);
        const response = yield result.response;
        const responseText = response.text();
        // Stores the conversation
        conversationContext.push([prompt, responseText]);
        res.send({ response: responseText });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.generateResponse = generateResponse;
