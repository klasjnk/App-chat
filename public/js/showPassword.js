window.onload = function () {
    // Login
    showPassword("#eye", "#password")

    // Register
    showPassword("#eye-1", "#password")
    showPassword("#eye-2", "#password-confirm")
}

function showPassword(idI, idP) {
    const eye = document.querySelector(idI)
    const password = document.querySelector(idP)

    if (eye) {
        eye.onclick = () => {
            if (password.type === "password") {
                password.type = "text"
                eye.classList.remove("fa-eye")
                eye.classList.add("fa-eye-slash")
            } else {
                password.type = "password"
                eye.classList.remove("fa-eye-slash")
                eye.classList.add("fa-eye")
            }
        }
    }

}

