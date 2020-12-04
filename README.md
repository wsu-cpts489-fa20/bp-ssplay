# ssplay-app features	
* a UI for speedgolfers who want to browse courses, rate courses, review courses, and book/pay for tee times;
* a UI for course operators who want to set speedgolf rates, specify available tee times, and receive payments for speedgolf reservations
* a UI is needed to allow users to specify the details of a given course: hole yardages, running distances, time pars, stroke pars. These details could be specified by speedgolfers familiar with the course, or by course operators.

# Link to website
https://ssplay.bfapp.org/

# Link to testing gifs
* Week 1
	https://drive.google.com/file/d/1D1yAcjRA58xQMfy4SfV9n2-pIF1aazCg/view?usp=sharing
	
* Week 2
	https://drive.google.com/file/d/12Ps2GfDvjzKIolzZiCActPQIomGOWO_h/view?usp=sharing

# Code Quality
SpecificCourses.js, AddCourses.js 

# Retrospective
* Week1: 
	* Goods:
		* The code progress is going well as we all try to implement features required. 
		* Code commits are being done consistently by everyone in the team.
		* Coding-wise, our team did a pretty good job.
	
	* Bads:
		* None of us paid much attention to the rubric so we were missing some key requirements which got us penalties on our grades.
* Week2: 
	* Completed:
		* Differentiate account type between "User" and "Operator"
		* Operator can add a Course with rates and tee time availability, on top of all functionalities that a User can do.
		* All users can book tee time. When choosing date and time if a slot is already booked, the UI will disable that timeslot. (Disable selection)
		* Updated the database to have actual information rather than random strings.
	* Struggles:
		* Figuring out how to set up the appointments schema for a course was quite a challenge, but once that was figured out, implementing the actual booking system posed lesser hardships.
		* Another small struggle was disabling the time slots, and getting a range of available dates for the Booking system.
		* Started deployment process but wasn't able to succesfully deploy.
* Week3: 
	* Completed:
		* Operator can now delete course
		* Operator can view all appointments, and delete any appointments
		* All users can pay for tee-time
		* All users can add a payment info (Card)
		* All users can view Nearby Courses (Google Maps API & Places API)
		* Reworked the logic of the Booking Tee Time
		* Deployed the website, fully functional
	* Struggles:
		* Figuring out how to do the booking tee time properly was a pain
		* Deployment was also a struggling as the environment won't recognize the variables
		* Doing the API for Nearby Courses was also hard, most examples are in HTML/CSS so I had to rework it into React
	* Needs Improvement:
		* Team communication and participation.
		* Distribute work properly.

