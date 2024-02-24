import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import { Padding } from '@mui/icons-material';

export default class puffleBlock extends Block {
  render() {
    const numbersInWords = [
      "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"
  ];
  
  const tensInWords = [
      "", "", "Twenty", "Thirty", "Forty", "Fifty"
  ];
  const mathProblems = [
    "There are watermelons at the park. Do you even like the park?",
    "If there are apples in the basket, would you go apple picking?",
    "Imagine there are bananas on the table. Do you find bananas appealing?",
    "Suppose there are cookies in the jar. Are you tempted to grab one?",
    "There are candies in the jar. Do you have a sweet tooth?",
    "If there are pizzas in the oven, are you ready for a feast?",
    "Imagine there are balloons at the party. Do you enjoy celebrations?",
    "There are cupcakes on the table. Do you have a craving for sweets?",
    "Imagine there are donuts at the bakery. Do you have a weakness for pastries?",
    "There are sandwiches on the picnic blanket. Do you enjoy outdoor lunches?",
    "If there are oranges in the fruit basket, do you like citrus fruits?",
    "Suppose there are strawberries in the garden. Do you enjoy gardening?",
    "Imagine there are slices of cake at the party. Do you have a sweet tooth?",
    "There are peaches in the fruit bowl. Do you enjoy summer fruits?",
    "Imagine there are slices of pizza at the party. Do you enjoy gatherings?",
    "There are lemons in the kitchen. Do you enjoy cooking?",
    "Suppose there are watermelons at the market. Do you like shopping?",
    "If there are apples in the basket, would you go apple picking?"
];
  function getTimeInWords(hours: number, minutes: number): string {
      let timeInWords = "";
      if (hours > 12) {
          hours -= 12;
      }
      if (hours === 0) {
          timeInWords += "Twelve";
      } else {
          timeInWords += numbersInWords[hours];
      }
      timeInWords += " ";
      if (minutes < 20) {
          timeInWords += numbersInWords[minutes];
      } else {
          const tensDigit = Math.floor(minutes / 10);
          const onesDigit = minutes % 10;
          timeInWords += tensInWords[tensDigit];
          if (onesDigit !== 0) {
              timeInWords += " " + numbersInWords[onesDigit];
          }
      }
      return timeInWords;
  }
  
  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  
  const timeInWords = getTimeInWords(hours, minutes);
  


  function getRandomMathProblem(): string {
    const randomIndex = Math.floor(Math.random() * mathProblems.length);
    return mathProblems[randomIndex];
}

function generateSentence(timeInWords: string): string {
  const problem = getRandomMathProblem();
  let problemWithTime: string;

  const thereIsIndex = problem.indexOf("there are");
  if (thereIsIndex !== -1) {
      const sentenceBeforeThereIs = problem.substring(0, thereIsIndex + "there are".length);
      const sentenceAfterThereIs = problem.substring(thereIsIndex + "there are".length);
      problemWithTime = `${sentenceBeforeThereIs} ${timeInWords}${sentenceAfterThereIs}`;
  } else {
      problemWithTime = problem.replace("There are", `There are ${timeInWords}`);
  }

  return problemWithTime;
}

const sentence = generateSentence(timeInWords);

const h1Style = {
  padding: '20px', 
  margin: '20px', 
};
  
    return (
      <div>
        <h1 style={h1Style}>{sentence}</h1>
      </div>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    return (
      <h1>Edit puffle Block!</h1>
    )
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}