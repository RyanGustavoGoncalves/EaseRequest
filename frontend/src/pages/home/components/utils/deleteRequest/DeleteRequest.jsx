 // Function to delete a request
 export const deleteRequest = async (token, editedRequest) => {
    try {
        const response = await fetch(`http://localhost:8080/request/${editedRequest.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            console.log('Request deleted successfully!');
        } else {

            console.error('Error deleting the request:', response.status);
        }
    } catch (error) {
        // Handle network or other errors
        console.error('Error making delete request:', error);
        // alert("Error fetching requests. Please try again later.");
    }
};