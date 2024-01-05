import moment from "moment";
import "moment/locale/pt-br";

// Calculate the time difference from the launch date

export const calculateTimeDifference = (launchDate) => {
    const currentDate = moment();
    const launchMoment = moment(launchDate);
    const duration = moment.duration(currentDate.diff(launchMoment));

    // Display the difference in days, hours, minutes, etc.
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();

    return `${days} days, ${hours} hour, ${minutes} minutes ago`;
};