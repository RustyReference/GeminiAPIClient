import { Request, Response } from "express";
import { Content, GoogleGenerativeAI, Part } from "@google/generative-ai";
import dotenv, { config } from "dotenv"

dotenv.config();

// GoogleGenerativeAI required config
const configuration = new GoogleGenerativeAI(process.env.API_KEY!);

// Model Initialization
const modelId = "gemini-2.0-flash-lite";
const model = configuration.getGenerativeModel({model: modelId});

// These arrays maintain the history of the conversation
const conversationContext: Part[][][] = [];
const currentMessages: Content[] = [];

// Controller function to handle chat conversation
export const generateResponse = async (req: Request, res: Response) => {
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
        
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const responseText = response.text();
        
        // Stores the conversation
        conversationContext.push([prompt, responseText]);
        res.send({ response: responseText }); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
