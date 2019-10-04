# NHL-TeamVersus
View the live deployment [here](https://elliotredhead.github.io/NHL-TeamVersus/)
-----

Page Summary

## User Experience
 
#### The target audience for this website is: 
* NHL fans that want to compare team statistics.

#### This project is the best way to deliver the content because:
* It is interactive, with the aim of delivering the statistics in a fun, animated way.
* It is fully-responsive, enabling use across a range of resolutions.
* The layout is intuitive, detailed instructions would not be required for the average user to access and use the site.
*

## User Stories (How are these fulfilled?)

1. As a user interested in a statistics comparison between two specific teams I want to manually select each team.
2. As a user interested in comparing two random teams I want a feature that randomly selects these for me.

### User Story Fulfilment

1. I click the first team selector dropdown and then select a team from the options provided, I will then do the same for the second dropdown. The compare button appears, allowing me to confirm my team choices. The winner is announced in an alert messagebox and the statistics for each team is automatically shown. The attributes that each team has won/lost/drawn for are highlighted with different colours.

2. I click the shuffle icon and two random teams are selected for me, the compare button appears allowing me to lock in these choices. The winner is announced in an alert messagebox and the statistics for each team is automatically shown. The attributes that each team has won/lost/drawn for are highlighted with different colours.

## Wireframes

1.
2.
3.

## Features

### Existing Features

#### Welcome Modal
The welcome modal gives a brief instruction to the user of how to operate the comparison tool, explaining both the manual selection and random selection functions.

#### Team Selection Dropdowns
The dropdown selectors allow the user to select the teams that they want to compare, they  function to pass the user selection to other processes but are styled to keep with the competitive but fun theme of the page.

#### Dynamic Team Logos
The team logo above the team selector dropdown changes dynamically based on the team chosen, for example if the team "Anaheim Ducks" is selected from the dropdown: the Anaheim Ducks team logo appears above. This also serves as feedback to the user that their selection has been correctly assigned.

#### Shuffle Button
The well-established icon for shuffling a selection is used in a button at the top of the page, this randomly selects two teams for the user to compare. The user can repeatedly shuffle the selected teams as many times as they like. The same team cannot be compared against itself and the shuffle function does not allow the same team to be randomly chosen for both dropdown selectors.

#### Compare Button
The compare button gives the user the ability to trigger the statistics comparison when they have selected the teams they want to match against each other. If the user were to accidentally pick the wrong team from the list, they have the ability to correct their selection before triggering the comparison.

#### Dynamic Background Size
Upon triggering the comparison of the two teams; the background size enlarges to fill the newly displayed statistics section, this ensure constinuity and adds dramatic effect by "focusing" closer.

#### Winner Declaration Modal
The winning team is stated using a sweetalerts modal box, this informs the user which team has won before the statistics are shown.

#### Statistics Lists
The statistics lists illustrate a breakdown of the attributes that have been used to compare these teams. They provide a user an idea of the factors that have been considered in the decision of the winner and highlighted in respective positive/neutral/negative colours to indicate their win/draw/loss state.

#### Statistic Descriptors
Tooltips give a brief description of each of the factors that are used to decide which team has won. They are described using as non-technical language as possible to also be accessible to people new to the sport.

#### Restart Button
Upon accessing the statistics portion of the page abutton labelled "Play Again" is also displayed. Upon clicking this, the page is reset to its initial state for the user to pick teams again.

## Technologies Used

1. HTML
2. CSS.
3. Javascript.
4. jQuery.
5. [Bootstrap](https://getbootstrap.com)
6. [Font Awesome](https://fontawesome.com/)
7. [Google Fonts](https://fonts.google.com/) is used to supply the main font for the majority of this website, the font sourced in this way is ["Teko"](https://fonts.google.com/specimen/Teko).
8. [SweetAlert2](https://sweetalert2.github.io/) is used for both the welcome and winning announcement modals on this site.

## Testing

1. Navigation (Larger Resolution)

2. Navigation (Smaller Resolution)

3. Team Selection Functionality

4. The "Shuffle" Button

5. Statistics Tooltips

6. The "Play Again" Button

Open the completed website across multiple devices and platforms, including Windows (Chrome), Linux (Chromium), Apple Mac (Safari), Apple iPhone (Safari) and Android Galaxy (Samsung Internet). Does the page load correctly and as was designed across target resolutions?

Use the [W3C](https://www.w3.org/) validators at the project's end and make adjustments if required, in accordance with the results.

### Known Bugs

With the statistics list already generated, if using a browser compatibility tool to check layout across resolutions the team logos in the statistics list will be an incorrect size. This is fixed by re-comparing the teams at the chosen test resolution. This layout bug does not affect standard use of the site, and is known to be present across other popular websites i.e. Facebook.

## Deployment

This project was developed using Visual Studio Code, and was both committed to git and pushed to GitHub using the integrated source control feature.

The setup for the GitHub Pages deployment was as follows:
- Log into Github.
- Select the target repository from the list.
- Select "Settings" from the menu items.
- Scroll to the Github Pages section.
- Under "Source" click the drop-down that is set to "None" and select "Master Branch".
- The link to the website is now displayed under the "Github Pages" section.

At the time of submission are both the deployed and development versions of this project identical?

## Run this Project Locally:

1. Open [the repository](https://github.com/ElliotRedhead/NHL-TeamVersus) in GitHub
2. Select the green "Clone or download" button.
3. Copy the clone URL for this repository.
4. In your local IDE open Git Bash.
5. Navigate to where the cloned directory should reside, make this the current working directory.
6. Type "git clone", and paste the clone URL.

```git clone https://github.com/ElliotRedhead/NHL-TeamVersus.git```

7. Press Enter.
8. The local clone is now created.

## Credits

### Media
The photos used in this site were obtained from the following sources:
1. Helmet favicon: From [flaticon](https://www.flaticon.com/) from the [smashicon authors](https://www.flaticon.com/authors/smashicons).

### Acknowledgements

Many thanks for support in the creation of this website to my mentor: [Simen Daehlin](https://github.com/Eventyret).