export async function getAI() {
    const { GoogleGenAI } = await import('@google/genai');

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

    // const response = await ai.models.generateContent({
    //     model: 'gemini-3-flash-preview',
    //     contents: 'Explain how AI works in a few words'
    // });
    // console.log(response.text);

    return ai ;
}

getAI();
