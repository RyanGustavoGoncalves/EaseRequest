// Function to create a new request
export const CreateNewRequest = async (formData, token) => {
    const data = {
        problem: formData.problem,
        description: formData.description,
        priority: formData.priority,
        status: formData.status
    };

    try {
        const response = await fetch("http://localhost:8080/request", {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            method: "POST",
            body: JSON.stringify(data),
        });

        if (response.status === 201) {
            alert("Successful registration!");
        } else if (response.status === 400) {
            const errorData = await response.json();
            const errorArray = [];

            for (const fieldName in errorData) {
                const errorMessage = errorData[fieldName];
                errorArray.push({ fieldName, errorMessage });
            }

        } else {
            console.log("An unexpected error occurred: " + response.status);
        }
    } catch (error) {
        console.log("Error sending the request:", error);
        // alert("Error fetching requests. Please try again later.");
    }
};