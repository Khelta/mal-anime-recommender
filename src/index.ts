const input_view = document.getElementById('input-view') as HTMLElement
const result_view = document.getElementById("result-view") as HTMLElement

const recommondationButton = document.getElementById("rec-button") as HTMLButtonElement
const backButton = document.getElementById("back-button") as HTMLElement

const usernameElement = document.getElementById("username") as HTMLFormElement
const formElement = document.getElementById("form") as HTMLFormElement
const alertElement = document.getElementById("alert") as HTMLElement
const titleElement = document.getElementById('recommondation-title') as HTMLElement
const textElement = document.getElementById('recommondation-text') as HTMLElement
const imageElement = document.getElementById('preview-image') as HTMLImageElement
const toggle = document.getElementById('darkModeToggle') as HTMLInputElement;
const icon = document.getElementById('toggle-icon') as HTMLElement;
const statusButtons = document.querySelectorAll('.btn-status') as NodeListOf<HTMLElement>

function handleRecommondationButtonClick() {
    const formData = new FormData(formElement)
    const username = formData.get("username")
    const selectedStatuses: string[] = [];

    document.querySelectorAll('.btn-status.active').forEach(button => {
        const status = button.getAttribute('data-status');
        if (status) {
            selectedStatuses.push(status);
        }
    });

    const status_string = selectedStatuses.join("")

    const hostUrl = window.location.origin;
    const apiUrl = `${hostUrl}/api/random_anime?username=${username}&status=${status_string}`;

    input_view.classList.add("disabled")
    alertElement.classList.add("hidden")

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            titleElement.textContent = data.title
            textElement.textContent = data.text
            imageElement.src = data.img_link

            input_view.classList.remove("disabled")
            input_view.classList.add("hidden")
            result_view.classList.remove("hidden")

        })
        .catch(error => {
            input_view.classList.remove("disabled")
            alertElement.classList.remove("hidden")
            alertElement.textContent = `Error: ${error.message}`;
        })

}

function handleBackButtonClick() {
    result_view.classList.add("hidden")
    input_view.classList.remove("hidden")
}

// Toggle status buttons
statusButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');
        validateButtonClickability()
    });
});

// Recommondation button 
recommondationButton.addEventListener('click', function (event) {
    event.preventDefault();
    handleRecommondationButtonClick()
});

function validateButtonClickability() {
    const formData = new FormData(formElement)
    const username = formData.get("username")

    let activeButtonCount = 0
    statusButtons.forEach(button => {
        if (button.classList.contains('active'))
            activeButtonCount += 1
    })

    if (!username) {
        recommondationButton.textContent = "🔍 A username is needed"
        recommondationButton.disabled = true
    }
    else if (activeButtonCount == 0) {
        recommondationButton.textContent = "🔍 At least one status filter is needed"
        recommondationButton.disabled = true
    }
    else {
        recommondationButton.textContent = "🔍 Get a Recommondation"
        recommondationButton.disabled = false
    }
};

usernameElement.addEventListener('input', validateButtonClickability)
backButton.addEventListener('click', handleBackButtonClick)


// Darkmode Toggle
let theme = "light"
document.body.setAttribute('data-theme', theme);
toggle.checked = theme === 'light';

toggle.addEventListener('change', () => {
    const newTheme = toggle.checked ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    icon!.textContent = toggle.checked ? '💡' : '🌙';
});

validateButtonClickability()
