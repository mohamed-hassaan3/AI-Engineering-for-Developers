
import "dotenv/config";
import OpenAI from "openai";

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
    throw new Error("Missing API key. Set OPENROUTER_API_KEY in .env");
}

if (!apiKey.startsWith("sk-or-")) {
    throw new Error("Invalid OpenRouter API key. OPENROUTER_API_KEY must start with 'sk-or-'");
}

const client = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "prompt-training"
    }
});

async function get_completion(prompt, model= "openai/gpt-oss-20b:free") {
    const messages = [{"role": "user", "content": prompt}]
    const response = await client.chat.completions.create({
        model: model,
        messages: messages,
        temperature: 0 
    })
    return response.choices[0].message.content
}

const text_1 = `
Making a cup of tea is easy! First, you need to get some \ 
water boiling. While that's happening, \ 
grab a cup and put a tea bag in it. Once the water is \ 
hot enough, just pour it over the tea bag. \ 
Let it sit for a bit so the tea can steep. After a \ 
few minutes, take out the tea bag. If you \ 
like, you can add some sugar or milk to taste. \ 
And that's it! You've got yourself a delicious \ 
cup of tea to enjoy.
"""
`
const text_2 = 
`
"""
The sun is shining brightly today, and the birds are \
singing. It's a beautiful day to go for a \ 
walk in the park. The flowers are blooming, and the \ 
trees are swaying gently in the breeze. People \ 
are out and about, enjoying the lovely weather. \ 
Some are having picnics, while others are playing \ 
games or simply relaxing on the grass. It's a \ 
perfect day to spend time outdoors and appreciate the \ 
beauty of nature.
"""
`
const prompt = `
"""
You will be provided with text delimited by triple quotes. 
If it contains a sequence of instructions, \ 
re-write those instructions in the following format:

Step 1 - ...
Step 2 - …
…
Step N - …

If the text does not contain a sequence of instructions, \ 
then simply write \"No steps provided.\"

\"\"\"${text_1}\"\"\"
"""
r`


get_completion(prompt)
    .then(console.log)
    .catch((error) => {
        const status = error?.status ?? "unknown";
        const message = error?.error?.message || error?.message || "Unknown error";
        console.error(`Request failed (${status}): ${message}`);
    });
