export const contactUs = () => {
    const toastId = toast.loading("Loading...");
    try{
        setLoading(true);
        const response = await apiConnector("POST", CONTACT_US_API, data);
        const response = {status:"OK"};
        // console.log("Logging response", response);
        setLoading(false);
    }
    catch(error) {
        console.log("Error:" , error.message);
        setLoading(false);
    }

    toast.dismiss((toastId));

}
