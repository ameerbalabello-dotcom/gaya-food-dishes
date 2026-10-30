const nodemailer = require("nodemailer");

exports.handler = async function(event) {

    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS"
            },
            body: ""
        };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({
                message: "Method not allowed."
            })
        };
    }

    try {

        const data = JSON.parse(event.body || "{}");

        const {
            name,
            phone,
            email,
            address,
            food,
            quantity,
            orderType,
            note
        } = data;

        if (!name || !phone || !email || !address || !food || !quantity) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Please complete all required fields."
                })
            };
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const restaurantEmail = process.env.EMAIL_TO;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: restaurantEmail,
            replyTo: email,
            subject: `New GAYA Food Dishes Order - ${name}`,

            html: `
                <h2>New GAYA Food Dishes Order</h2>

                <h3>Customer Information</h3>

                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Address:</strong> ${address}</p>

                <h3>Order Information</h3>

                <p><strong>Food:</strong> ${food}</p>
                <p><strong>Quantity:</strong> ${quantity}</p>
                <p><strong>Order Type:</strong> ${orderType || "Delivery"}</p>
                <p><strong>Additional Note:</strong> ${note || "None"}</p>

                <hr>

                <p>
                    This order was submitted through the
                    <strong>GAYA Food Dishes</strong> website.
                </p>
            `
        };

        await transporter.sendMail(mailOptions);

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: "Order submitted successfully."
            })
        };

    } catch (error) {

        console.error("Order email error:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Unable to process the order right now."
            })
        };
    }
};
