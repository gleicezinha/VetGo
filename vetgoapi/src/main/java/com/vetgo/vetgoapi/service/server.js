import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Credenciais do Twilio (coloque no .env)
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

// 1️⃣ Enviar código via WhatsApp
app.post("/send-code", async (req, res) => {
  const { phone } = req.body;

  try {
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: `whatsapp:${phone}`, // importante: whatsapp: + número
        channel: "whatsapp",
      });

    res.json({ status: verification.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2️⃣ Verificar código
app.post("/verify-code", async (req, res) => {
  const { phone, code } = req.body;

  try {
    const check = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({
        to: `whatsapp:${phone}`,
        code,
      });

    res.json({ status: check.status }); // "approved" = código correto
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("✅ API rodando na porta 3000"));
