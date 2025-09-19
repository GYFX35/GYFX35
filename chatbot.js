document.addEventListener('DOMContentLoaded', () => {
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const languageSelect = document.getElementById('language-select');

    let currentLanguage = 'en';

    const conversation = {
        'en': {
            triggers: [
                ["hi", "hey", "hello", "good morning"],
                ["help", "what can you do", "support"],
                ["services", "products", "what do you offer"],
                ["pricing", "cost", "how much"],
                ["contact", "phone number", "email"],
                ["bye", "goodbye", "see you"]
            ],
            replies: [
                ["Hello! How can I help you today?", "Hi there! What can I do for you?"],
                ["I can provide information about our services, pricing, and contact details. What would you like to know?"],
                ["We offer a range of services including global logistics, market analysis, and compliance consulting. Which one are you interested in?"],
                ["Our pricing varies depending on the service. Could you tell me which service you are interested in for a more detailed quote?"],
                ["You can reach us at support@globalbiz.com or call us at +1-234-567-890."],
                ["Goodbye! Have a great day!", "See you later!"]
            ],
            fallback: [
                "I'm sorry, I didn't understand that. Can you please rephrase?",
                "I'm not sure how to help with that. You can ask me about services, pricing, or contact information."
            ],
            greeting: "Hello! I'm the Global Biz Assistant. How can I help you?"
        },
        'es': {
            triggers: [
                ["hola", "buenos dias"],
                ["ayuda", "que puedes hacer", "soporte"],
                ["servicios", "productos", "que ofrecen"],
                ["precio", "costo", "cuanto cuesta"],
                ["contacto", "telefono", "correo"],
                ["adios", "hasta luego"]
            ],
            replies: [
                ["¡Hola! ¿En qué puedo ayudarte hoy?", "¡Hola! ¿Qué puedo hacer por ti?"],
                ["Puedo proporcionar información sobre nuestros servicios, precios y detalles de contacto. ¿Qué te gustaría saber?"],
                ["Ofrecemos una gama de servicios que incluyen logística global, análisis de mercado y consultoría de cumplimiento. ¿Cuál te interesa?"],
                ["Nuestros precios varían según el servicio. ¿Podrías decirme en qué servicio estás interesado para darte una cotización más detallada?"],
                ["Puedes contactarnos en soporte@globalbiz.com o llamarnos al +1-234-567-890."],
                ["¡Adiós! ¡Que tengas un buen día!", "¡Hasta luego!"]
            ],
            fallback: [
                "Lo siento, no entendí eso. ¿Puedes reformularlo, por favor?",
                "No estoy seguro de cómo ayudar con eso. Puedes preguntarme sobre servicios, precios o información de contacto."
            ],
            greeting: "¡Hola! Soy el Asistente de Global Biz. ¿Cómo puedo ayudarte?"
        }
    };

    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = text;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function getBotResponse(userInput) {
        const langData = conversation[currentLanguage];
        const text = userInput.toLowerCase().replace(/[^\w\s]/gi, '');

        for (let i = 0; i < langData.triggers.length; i++) {
            for (let j = 0; j < langData.triggers[i].length; j++) {
                if (text.includes(langData.triggers[i][j])) {
                    const replies = langData.replies[i];
                    return replies[Math.floor(Math.random() * replies.length)];
                }
            }
        }

        const fallback = langData.fallback;
        return fallback[Math.floor(Math.random() * fallback.length)];
    }

    function handleUserInput() {
        const userInput = chatbotInput.value.trim();
        if (userInput) {
            addMessage(userInput, 'user');
            chatbotInput.value = '';
            setTimeout(() => {
                const botResponse = getBotResponse(userInput);
                addMessage(botResponse, 'bot');
            }, 500); // Simulate bot thinking
        }
    }

    function changeLanguage() {
        currentLanguage = languageSelect.value;
        chatbotMessages.innerHTML = ''; // Clear chat history
        addMessage(conversation[currentLanguage].greeting, 'bot');
    }

    chatbotSend.addEventListener('click', handleUserInput);
    chatbotInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleUserInput();
        }
    });
    languageSelect.addEventListener('change', changeLanguage);

    // Initial greeting
    addMessage(conversation[currentLanguage].greeting, 'bot');
});
