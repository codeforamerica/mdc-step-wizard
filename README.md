Miami-Dade County's STEP Wizard
===============================

Where STEP == short-term event permitting

The County has massive issues sharing information, especially about complicated processes like event permitting. 

Stack (initially): 
- HTML
- CSS (Sass is overkill at this point)
- Javascript & jQuery. 

Shouldn't need to be server-side at all...but we'll see. 

See for plain-English process: [https://docs.google.com/a/codeforamerica.org/document/d/1F4e0p_KdKMVyabtzmJaZncVl3tO4LrdwaBOodx1wWDM/edit?usp=drivesdk](Google Drive)

Cross-domain issues meant that using the County's APIs required a hack; trying Google Maps API for Javascript for their geocoding services (Google doesn't recommend their existing geocoding API for dynamic requests and points you to their mapping API instead). The use of the Google geocoder means I can take that lat/lng result and use it to hit the Miami API. 