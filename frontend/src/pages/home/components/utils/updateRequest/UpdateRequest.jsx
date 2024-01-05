// Function to update a request
export const updateRequest = async (token, editedRequest, setSingleRequest) => {
    try {
        const response = await fetch(`http://localhost:8080/request/${editedRequest.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(editedRequest),
        });

        if (response.ok) {
            // Successful update
            console.log('Request updated successfully!');

            setSingleRequest({ ...editedRequest });
        } else {
            // Handle response errors
            console.error('Error updating request:', response.status);
        }
    } catch (error) {
        // Handle network or other errors
        console.error('Error making update request:', error);
        // alert("Error fetching requests. Please try again later.");
    }
};