const filterButtons = document.querySelectorAll(".filter-button");
const foodCards = document.querySelectorAll(".food-card");
const addButtons = document.querySelectorAll(".add-button");

const selectedFood = document.getElementById("selected-food");
const orderForm = document.getElementById("order-form");
const formMessage = document.getElementById("form-message");
const orderStatus = document.getElementById("order-status");

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const category = button.dataset.category;

        filterButtons.forEach(function(item) {
            item.classList.remove("active");
        });

        button.classList.add("active");

        foodCards.forEach(function(card) {

            if (category === "all" || card.dataset.category === category) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }

        });

    });

});


addButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const food = button.dataset.food;

        selectedFood.value = food;

        orderStatus.textContent = food + " selected";

        document.getElementById("order").scrollIntoView({
            behavior: "smooth"
        });

    });

});


orderForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const name =
        document.getElementById("customer-name").value.trim();

    const phone =
        document.getElementById("customer-phone").value.trim();

    const email =
        document.getElementById("customer-email").value.trim();

    const address =
        document.getElementById("delivery-address").value.trim();

    const food =
        document.getElementById("selected-food").value;

    const quantity =
        document.getElementById("food-quantity").value;

    const orderType =
        document.getElementById("order-type").value;

    const note =
        document.getElementById("order-note").value.trim();


    if (!name || !phone || !email || !address || !food || !quantity) {

        formMessage.textContent =
            "Please complete all required fields.";

        return;
    }


    formMessage.textContent =
        "Submitting your order...";


    try {

        const response = await fetch("/api/order", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                phone,
                email,
                address,
                food,
                quantity,
                orderType,
                note
            })

        });


        const data = await response.json();


        if (!response.ok) {

            formMessage.textContent =
                data.message || "Unable to submit your order.";

            return;
        }


        formMessage.textContent =
            "Order submitted successfully! GAYA Food Dishes will contact you shortly.";

        orderStatus.textContent =
            quantity + " × " + food;

        orderForm.reset();

        selectedFood.value = food;

    } catch (error) {

        console.error("Order submission error:", error);

        formMessage.textContent =
            "Unable to connect to the order service. Please try again.";

    }

});
