/* AppMode: The enumerated type for AppMode. */

const AppMode = {
    LOGIN: "LoginMode",
    FEED: "FeedMode",
    ROUNDS: "RoundsMode",
    ROUNDS_LOGROUND: "RoundsMode-LogRound",
    ROUNDS_EDITROUND: "RoundsMode-EditRound",
    COURSES: "CoursesMode",
    COURSES_NEARBY: "CoursesMode-Nearby",
    COURSES_ALL: "CoursesMode-All",
    COURSES_ADD: "CoursesMode-ADD"
};

Object.freeze(AppMode); //This ensures that the object is immutable.

export default AppMode;