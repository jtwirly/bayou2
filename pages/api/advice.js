const { Configuration, OpenAIApi } = require("openai");

// Setup OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      await getAdvice(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

const getAstrologicalSign = (birthday) => {
  const birthDate = new Date(birthday);
  const month = birthDate.getMonth() + 1; // Months are zero-indexed
  const day = birthDate.getDate();
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";

  // This line should not be reached if the function is implemented correctly
  return "undefined";
};

const calculateAge = (birthday) => {
  const birthDate = new Date(birthday);
  const currentDate = new Date();
  const ageDiff = currentDate - birthDate;
  const age = Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
  return age;
};

const getAdvice = async (req, res) => {
  try {
    const age = calculateAge(req.query.birthday);
    if (age < 18) {
      res.status(200).json({ text: "I'm sorry, you're not old enough." });
      return;
    }
    const astrologicalSign = getAstrologicalSign(req.query.birthday);
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `Give me a clairvoyant or psychic fortune for someone with the astrological sign ${astrologicalSign} on '${req.query.prompt}'`,
      max_tokens: 200,
    });
    const firstPart = getRandomEncouragement();
    const secondPart = `I know it's on your mind and so ${req.query.timeOfDay}.`;
    const thirdPart = "I know this reading won't give you all the answers you seek";
    const fourthPart = completion.data.choices[0].text.trim();
    const fifthPart = `As a ${astrologicalSign}, I know that you wanted more clarification.`;
    const sixthPart = getRandomCTA();

    const finalOutput = `${firstPart}. ${secondPart} ${thirdPart}. ${fourthPart} ${fifthPart} ${sixthPart}`;

    res.status(200).json({ text: finalOutput });
  } catch (error) {
if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send(error.message);
    }
  }
};

const getRandomEncouragement = () => {
  const encouragements = [
    "You had the courage to ask",
    "You are brave for seeking answers",
    "It's great that you're being proactive",
  ];
  return encouragements[Math.floor(Math.random() * encouragements.length)];
};

const getRandomCTA = () => {
  const ctas = [
    "We recommend a one-on-one reading to understand this in more detail.",
    "Consider seeking guidance from a mentor or trusted friend.",
    "Reflect on your life experiences and trust your intuition.",
  ];
  return ctas[Math.floor(Math.random() * ctas.length)];
};

export default handler;
