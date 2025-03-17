$(document).ready(function () {
    let cart = [];
    let totalPrice = 0;

    $(".add-to-cart").click(function () {
        let name = $(this).data("name");
        let price = parseFloat($(this).data("price"));

        if (!name || isNaN(price)) {
            console.error("Invalid item data:", { name, price });
            return;
        }

        cart.push({ name, price });
        totalPrice += price;
        updateCart();
    });

    function updateCart() {
        $("#cart-items").empty();
        cart.forEach((item, index) => {
            $("#cart-items").append(`
                <li>${item.name} - $${item.price.toFixed(2)}
                <button class="remove-item" data-index="${index}">X</button></li>`);
        });

        $("#total-price").text(totalPrice.toFixed(2));

        $(".remove-item").off("click").on("click", function () {
            let index = $(this).data("index");
            totalPrice -= cart[index].price;
            cart.splice(index, 1);
            updateCart();
        });
    }

    $("#place-order").click(function () {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        $.ajax({
            url: "order.php", // Replace with your server-side URL
            type: "POST",
            data: { order: JSON.stringify(cart), total: totalPrice.toFixed(2) },
            success: function (response) {
                $(".popup").fadeIn();
                $(".popup-message").text("Order placed successfully!\n" + response);
                cart = [];
                totalPrice = 0;
                updateCart();
            },
            error: function () {
                alert("Order placed successfully!");
            }
        });
    });

    $(".popup button").click(function () {
        $(".popup").fadeOut();
    });
});