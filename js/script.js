// =============================
// LOGIN FUNCTION
// =============================
function login() {
    window.location.href = "dashboard.html";
}


// =============================
// EMERGENCY SOS
// =============================
function emergencySOS() {

    let caregiverName =
        localStorage.getItem("caregiverName");

    let caregiverNumber =
        localStorage.getItem("caregiverNumber");

    if (!caregiverNumber) {
        alert("No caregiver number found. Please register first.");
        return;
    }

    const confirmSOS = confirm(
        "Send emergency alert to " +
        (caregiverName || "Caregiver") +
        "?"
    );

    if (confirmSOS) {
        window.location.href =
            "sms:" +
            caregiverNumber +
            "?body=Emergency! The patient needs immediate assistance.";
    }
}


// =============================
// LIVE DATE, TIME & GREETING
// =============================
function updateDateTime() {

    const now = new Date();

    const hour = now.getHours();

    let greeting = "";

    if (hour < 12) {
        greeting = "Good Morning";
    }
    else if (hour < 17) {
        greeting = "Good Afternoon";
    }
    else if (hour < 21) {
        greeting = "Good Evening";
    }
    else {
        greeting = "Good Night";
    }


    const greetingElement =
        document.getElementById("greeting");

    const dateElement =
        document.getElementById("date");

    const clockElement =
        document.getElementById("clock");


    if (greetingElement) {
        greetingElement.innerHTML =
            greeting + " 👋";
    }


    if (dateElement) {

        dateElement.innerHTML =
            now.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            });
    }


    if (clockElement) {

        let hours = now.getHours();

        const minutes =
            String(now.getMinutes()).padStart(2, "0");

        const seconds =
            String(now.getSeconds()).padStart(2, "0");

        const period =
            hours >= 12 ? "PM" : "AM";

        hours = hours % 12;

        if (hours === 0) {
            hours = 12;
        }

        clockElement.textContent =
            String(hours).padStart(2, "0") +
            ":" +
            minutes +
            ":" +
            seconds +
            " " +
            period;
    }
}


// Start clock
updateDateTime();

setInterval(updateDateTime, 1000);


// =============================
// MARK MEDICINE AS TAKEN
// =============================
function markTaken(button) {

    const row = button.closest("tr");

    if (!row) {
        return;
    }

    const medicineName =
        row.cells[0].innerText.trim();

    const statusCell =
        row.cells[3];


    // Change status
    statusCell.innerHTML =
        '<span style="color:green;">✔ Taken</span>';


    // Change button
    button.innerHTML = "Taken";

    button.disabled = true;


    // Save status
    localStorage.setItem(
        medicineName,
        "taken"
    );


    // Update dashboard progress
    updateMedicineProgress();
}


// =============================
// RESTORE MEDICINE STATUS
// =============================
function restoreMedicineStatus() {

    const buttons =
        document.querySelectorAll(".take-btn");


    buttons.forEach(function(button) {

        const row =
            button.closest("tr");

        if (!row) {
            return;
        }

        const medicineName =
            row.cells[0].innerText.trim();


        if (
            localStorage.getItem(medicineName)
            === "taken"
        ) {

            button.innerHTML = "Taken";

            button.disabled = true;


            row.cells[3].innerHTML =
                '<span style="color:green;">✔ Taken</span>';
        }

    });


    updateMedicineProgress();
}


// =============================
// MEDICINE PROGRESS
// =============================
function updateMedicineProgress() {

    const medicines = [
        "BP Tablet",
        "Vitamin D",
        "Memory Tablet",
        "Calcium Tablet"
    ];


    let takenCount = 0;


    medicines.forEach(function(medicine) {

        if (
            localStorage.getItem(medicine)
            === "taken"
        ) {

            takenCount++;
        }

    });


    const totalMedicines =
        medicines.length;


    const percentage =
        Math.round(
            (takenCount / totalMedicines) * 100
        );


    const progressFill =
        document.getElementById(
            "medicineProgressFill"
        );


    const progressText =
        document.getElementById(
            "medicineProgressText"
        );


    if (progressFill) {

        progressFill.innerHTML =
            percentage + "%";

        progressFill.style.width =
            percentage + "%";
    }


    if (progressText) {

        progressText.innerHTML =
            takenCount +
            " out of " +
            totalMedicines +
            " medicines taken today.";
    }
}


// =============================
// PAGE LOAD
// =============================
window.addEventListener("load", function() {

    restoreMedicineStatus();

    updateMedicineProgress();

});