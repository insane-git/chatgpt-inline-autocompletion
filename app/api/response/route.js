import { OpenAIStream } from "@/utils/stream";

export const POST = async (req) => {
  const { prompt } = await req.json();

  if (!prompt) {
    console.log("Missing prompt");
    return new Response("Missing prompt", { status: 400 });
  }
  var BasicCommands = [
    {
      role: "system",
      content:
        "You are a highly intelligent chatbot with a deep understanding of programming and software development. Your purpose is to provide code completion only if the code is already complete than don't answer",
    },
  ];
  var messages = [{ role: "user", content: `${prompt}` }];

  const AllMessages = BasicCommands.concat(messages);
  const payload = {
    model: "gpt-3.5-turbo-16k",
    messages: AllMessages,
    temperature: 0.1,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 0,
    max_tokens: 5000,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);

  return new Response(stream);
};
