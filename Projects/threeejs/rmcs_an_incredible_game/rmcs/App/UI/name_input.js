import { ready } from "../Utils/Store"
import { playerinfo } from "../Utils/Store";

export default class name_input
{
    constructor()
    {
        let players = [];

        // player1 
        this.button1 = document.querySelector(".btn1")
        this.player1div = document.querySelector(".p1div")
        this.player1data = document.querySelector(".p1div input")

        //player2
        this.button2 = document.querySelector(".btn2")
        this.player2div = document.querySelector(".p2div")
        this.player2data = document.querySelector(".p2div input")

        //player3
        
        this.button3 = document.querySelector('.btn3')
        this.player3div = document.querySelector('.p3div')
        this.player3data = document.querySelector(".p3div input")

        //player4

        this.button4 = document.querySelector('.btn4')
        this.player4div = document.querySelector('.p4div')
        this.player4data = document.querySelector(".p4div input")

        //After input

        this.introDiv = document.querySelector('.intro')
        

        ready.subscribe((state)=>{

            // player 1

            this.player1div.classList.add('player1input')

            window.setTimeout(() => {
                this.player1div.classList.add('fadeIn')
            }, 150)

            this.button1.addEventListener('click', () => {
                this.inputData1 = this.player1data.value;
                if (!checkempty(this.inputData1)){
                    // this.playerinfo.setState({player1:this.inputData1})
                    players.push(this.inputData1)
                    this.player1div.classList.add('fadeOut')
                    this.player2div.classList.add('player2input')
                    window.setTimeout(() => {
                        this.player2div.classList.add('fadeIn')
                    }, 200)
                }
                else{
                    alert("Please enter a valid name")
                }
            })

            // Player 2

            this.button2.addEventListener('click', () => {
                this.inputData2 = this.player2data.value;
                if (!checkempty(this.inputData2)){
                    if (this.inputData1.trim().toLowerCase() === this.inputData2.trim().toLowerCase()){
                        alert("Please enter unique name")
                    }
                    else{
                        // this.playerinfo.setState({player2:this.inputData2})
                        players.push(this.inputData2)
                        this.player2div.classList.add('fadeOut')
                        this.player3div.classList.add('player3input')
                        window.setTimeout(() => {
                            this.player3div.classList.add('fadeIn')
                        }, 200)
                        this.player1div.classList.remove('player1input')
                    }
                }
                else{
                    alert("Please enter a valid name")
                }
            })

            // Player 3 eventlistener

            this.button3.addEventListener('click', () => {
                this.inputData3 = this.player3data.value;
                if (!checkempty(this.inputData3)){
                    if ((this.inputData2.trim().toLowerCase() === this.inputData3.trim().toLowerCase()) || (this.inputData1.trim().toLowerCase() === this.inputData3.trim().toLowerCase())){
                        alert("Please enter unique name")
                    }
                    else{
                        // this.playerinfo.setState({player3:this.inputData3})
                        players.push(this.inputData3)
                        this.player3div.classList.add('fadeOut')
                        this.player4div.classList.add('player4input')
                        window.setTimeout(() => {
                            this.player4div.classList.add('fadeIn')
                        }, 200)
                        this.player2div.classList.remove('player1input')
                    }
                }
                else{
                    alert("Please enter a valid name")
                }
            })

            // Player 4 eventlistener
            
            this.button4.addEventListener('click', () => {
                this.inputData4 = this.player4data.value;
                if (!checkempty(this.inputData4)){
                    if ((this.inputData3.trim().toLowerCase() === this.inputData4.trim().toLowerCase()) || (this.inputData2.trim().toLowerCase() === this.inputData4.trim().toLowerCase()) || (this.inputData1.trim().toLowerCase() === this.inputData4.trim().toLowerCase()) ){
                        alert("Please enter unique name")
                    }
                    else{
                        players.push(this.inputData4)
                        console.log(players)
                        this.player4div.classList.add('fadeOut')
                        this.introDiv.classList.add('container1')
                        const text = "Are You Ready to Dive into The virtual world of RMCS : The Incredible Game";
                        const container = document.getElementsByClassName('text-input')[0];
                        console.log(container)
                        let index = 0;

                        function displayNextWord() {
                            if (index < text.length) {
                                container.innerHTML += text[index];
                                index++;
                                setTimeout(displayNextWord, 50); // Adjust the delay as needed
                            }
                        }
                    
                        displayNextWord();
                        this.player3div.classList.remove('player3input')
                        let randnum = generateUniqueRandomNumbers()
                        console.log(randnum)
                        playerinfo.setState({
                            Raja: players[randnum[0]],
                            Mantri: players[randnum[1]],
                            Chor: players[randnum[2]],
                            Sipahi: players[randnum[3]]
                          });
                        console.log(playerinfo)
                    }
                }
                else{
                    alert("Please enter a valid name")
                }
            })

        })
    }


}
function checkempty(data){
    if (data.trim() ===''){
        return true;
    }
    else{
        return false;
    }
}

function generateUniqueRandomNumbers() {
    const numbers = new Set();
  
    while (numbers.size < 4) {
      const randomNum = (Math.floor(Math.random() * 10000)%4);
      numbers.add(randomNum); 
    }
  
    return Array.from(numbers);
  }
//   console.log(generateUniqueRandomNumbers() )


