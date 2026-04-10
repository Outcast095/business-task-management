// src/server/utils/email.service.ts
import { Resend } from 'resend';

// Инициализируем Resend, используя ключ из переменных окружения
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (to: string, token: string): Promise<void> => {
  console.log(`[EMAIL API] Попытка отправить письмо через Resend на ${to}`);

  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      // Пока у тебя нет своего домена, используй этот адрес отправителя:
      from: 'My Todo App <onboarding@resend.dev>',
      to: [to],
      subject: 'Подтвердите ваш email — My Todo App',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2>Добро пожаловать!</h2>
          <p>Для завершения регистрации нажмите на кнопку ниже:</p>
          <div style="margin: 25px 0;">
            <a href="${verificationUrl}" 
               style="background: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px;">
              ✅ Подтвердить регистрацию
            </a>
          </div>
          <p style="font-size: 12px; color: #888;">Ссылка действительна 24 часа.</p>
        </div>
      `,
    });

    if (error) {
      console.error('[EMAIL API] ❌ Ошибка от Resend:', error.message);
      throw error;
    }

    console.log(`[EMAIL API] ✅ Письмо отправлено! ID транзакции: ${data?.id}`);
  } catch (err: any) {
    console.error(`[EMAIL API] ❌ Ошибка выполнения:`, err.message);
    throw err;
  }
};