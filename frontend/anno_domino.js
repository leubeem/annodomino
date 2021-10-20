Array.prototype.insert = function ( index, item ) {
    this.splice( index, 0, item );
};

var app = new Vue({
    el: '#app',
    data: {
        milestones: [],
        currentMilestone: null,
        gameRunning: false
    },
    computed: {
        milestonesJudged: function() {

            // compute for display
            let milestonesJudged = this.milestones.map((m)=>{
                return {
                    ...m, 
                    intYear: m.year,
                    year: m.year < 0 ? Math.abs(m.year)+" v. Chr." : m.year, 
                    correct:true
                }
            })

            // if nothing can be wrong
            if(milestonesJudged.length < 1)
                return milestonesJudged

            // check which are wrong
            let currentYear = milestonesJudged[0].year;
            for(let i=1;i<milestonesJudged.length;i++) {
                 if(currentYear>milestonesJudged[i].year)
                    milestonesJudged[i].correct = false
                 else
                    currentYear = milestonesJudged[i].year
            }

            // if endgame, sort them
            if(!this.gameRunning) {
                milestonesJudged = milestonesJudged.sort((a,b)=>a.intYear>b.intYear)
            }

            return milestonesJudged
        }
    },
    methods: {
        getRandomMilestone: function() {
            let randYear = Math.round(Math.random()*4021)-2000;
            let milestone = {year: randYear, title: "Ereignis aus dem Jahre "+randYear+"."}
            this.currentMilestone = milestone

            console.log("got milestone",milestone)
        },
        checkMilestones: function() {
            this.gameRunning = this.milestonesJudged.filter(m=>!m.correct).length == 0

            console.log("judged", this.milestonesJudged)
        },
        insertMilestoneAt: function(index) {
            this.milestones.insert(index, this.currentMilestone)
            this.checkMilestones()
            this.getRandomMilestone()
        },
        startGame: function() {
            this.milestones = []
            this.getRandomMilestone()
            this.insertMilestoneAt(0)
            this.gameRunning = true

            console.log("started new game")
        }
    },
    mounted: function() {
        this.startGame()
    }
})
