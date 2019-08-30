# NHL-TeamVersus
View the live deployment [here](https://elliotredhead.github.io/NHL-TeamVersus/)
-----

Page Summary

## User Experience
 
#### The target audience for this website is: 
* NHL fans that want to compare team statistics.

#### This project is the best way to deliver the content because:
* It is interactive, with the aim of delivering the statistics in an animated way.
* 
*
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

#### Team Selection Dropdowns
The dropdown selectors allow the user to select the teams that they want to compare, they  function to pass the user selection to other processes but are styled to keep with the competitive but fun theme of the page.

#### Dynamic Team Logos
The team logo above the team selector dropdown changes dynamically based on the team chosen, for example if the team "Anaheim Ducks" is selected from the dropdown: the Anaheim Ducks team logo appears above. This also serves as feedback to the user that their selection has been correctly assigned.

#### Compare Button
The compare button gives the user the ability to trigger the statistics comparison when they have selected the teams they want to match against each other. If the user were to accidentally pick the wrong team from the list, they have the ability to correct their selection before triggering the comparison.

#### Statistics Lists
The statistics lists illustrate a breakdown of the attributes that have been used to compare these teams. They provide a user an idea of the factors that have been considered in the decision of the winner and highlighted in respective positive/neutral/negative colours to indicate their win/draw/loss state.

### Features Left to Implement
#### Welcome Modal
#### Updated Unknown Team Selection Icon
#### Statistic Descriptors (TBD) https://codepen.io/nbalcom/pen/ozwqvb
#### Winner Declaration Modal (TBD)
#### Restart Prompt (TBD)
#### Share Feature (TBD)

## Technologies Used

1. HTML
2. CSS.
3. Javascript.
4. jQuery.
5. The developer used [Visual Studio Code](https://code.visualstudio.com/) to create the website. This was chosen due to the developer having established experience within this software and for its Github integration.
6. [Bootstrap](https://getbootstrap.com)
7. [FontAwesome](https://fontawesome.com/)
8. [GoogleFonts](https://fonts.google.com/) is used to supply the fonts for the majority of texts across this website, the fonts sourced in this way were x and y.

## Testing

1. Navigation (Larger Resolution)

2. Navigation (Smaller Resolution)

3.

4. Links
    
5. Share Options

Open the completed website across multiple devices and platforms, including Windows (Chrome), Linux (Chromium), Apple Mac (Safari), Apple iPhone (Safari) and Android Galaxy (Samsung Internet). Does the page load correctly and as was designed across all platforms?

How is troubleshooting approached?

Use the [W3C](https://www.w3.org/) validators and make in accordance with the results.

### Known Bugs

With the statistics list already generated, if using a browser compatibility tool to check layout across resolutions the team logos in the statistics list will be an incorrect size. This is fixed by re-comparing the teams at the chosen test resolution.

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

**i.e. "git clone https://github.com/ElliotRedhead/NHL-TeamVersus.git"**

7. Press Enter.
8. The local clone is now created.

## Credits

### Media
The photos used in this site were obtained from the following sources:
1.
2.

### Acknowledgements

Many thanks for support in the creation of this website to my mentor: Simen Daehlin.