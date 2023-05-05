import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessageRoleEnum,
  ChatCompletionResponseMessage,
} from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const tripleBackticksRegex = /```(.+?)```/;
const tripleBackticksJsonRegex = /^```json.*?```$/;

export async function getCompletion(
  prompt: string,
  systemMessage = "",
  temperature = 0,
  model = "gpt-3.5-turbo",
) {
  const messages: ChatCompletionResponseMessage[] = [
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: prompt,
    },
  ];

  if (systemMessage.length > 0) {
    messages.unshift({
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: systemMessage,
    });
  }

  const completion = await openai.createChatCompletion({
    model,
    messages,
    temperature,
  });
  console.log(JSON.stringify(completion.data, null, 2));

  const content = completion.data.choices[0].message?.content;

  if (content?.match(tripleBackticksRegex)) {
    return content.match(tripleBackticksRegex)?.[1];
  }
  if (content?.match(tripleBackticksJsonRegex)) {
    return content.match(tripleBackticksJsonRegex)?.[1];
  }
  if (content?.startsWith("```json") && content.endsWith("```")) {
    return content.slice(7, -3);
  }
  return content;
}
