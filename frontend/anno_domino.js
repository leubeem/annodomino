Array.prototype.insert = function ( index, item ) {
    this.splice( index, 0, item );
};

// where the API sits
const API_URL = "http://die-leugers.de:8081"

// bypass api for DEV purposes
const BYPASS_API = !true

// get vue up and running
var app = new Vue({

    // mount our app in this div
    el: '#app',

    // our data store
    data: {

        // all milestones the user already put in order
        milestones: [],

        // our heap of quests to chose from next
        cachedNextMilestones: [],

        // the currently displayed milestone which the user has to insert somewhere
        currentMilestone: null,

        // is the game in halt mode (when loading initially or when game over)
        gameRunning: false

    },

    // computed data
    computed: {

        // prep milestones for game display, for instance if they are in good order, or provide
        // human readable negative dates
        milestonesJudged: function() {

            if(this.milestones.length == 0 && this.currentMilestone != null) {
                this.insertMilestoneAt(0)
            }

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
            // therefore know, how it'd be right
            let correct = [...this.milestones]
            correct = correct.sort((a,b)=>a.year > b.year)
            // lets start with the lowest 
            let currentIndex = 0

            console.log("correct",correct.map(o=>o.year))
            console.log("uncorrect",this.milestones.map(o=>o.year))

            // go through each step
            for(let index=0;index<milestonesJudged.length;index++) {

                // if the current year is the same as we expect it from current Index, then it is okay.
                if(correct[currentIndex].year!=this.milestones[index].year)
                    milestonesJudged[index].correct = false
                else
                    currentIndex++
            }

            return milestonesJudged
        }
    },

    // all game logic
    methods: {


        // for DEV purposes only
        // mocks a fake milestone
        getDummyMilestone: function() {

            let randYear = Math.round(Math.random()*4021)-2000;
            let milestone = {year: randYear, title: "Ereignis aus dem Jahre "+randYear+"."}
            return milestone

        },

        // lets not call the api for everyd single milestone, but once in a while
        // we need to get some more milestones into local cache
        fillCacheWithMoreAPIMilestones: function(finallyCall_GetRandomMilestone) {
            fetch(API_URL+"/milestones")
                .then(d=>d.json())
                .then(milestones=>{
                    this.cachedNextMilestones.push(...milestones)
                    if(finallyCall_GetRandomMilestone)
                        this.getRandomMilestone()
                })
                .catch(e => console.error("api couldnt fetch",e))

        },

        // picks a new milestone for the user and puts it in this.currentMilestone
        getRandomMilestone: function() {

            if(BYPASS_API) {

                //load fake data
                this.currentMilestone = this.getDummyMilestone()

            } else {


                // check if there are milestones in cache
                if(this.cachedNextMilestones.length > 0)
                    this.currentMilestone = this.cachedNextMilestones.shift()
                // otherwise get some more and tell the api to afterwards recall this function
                else 
                    this.fillCacheWithMoreAPIMilestones(true)

            }

        },

        // check if milestones are in order
        checkMilestones: function() {
            this.gameRunning = this.milestonesJudged.filter(m=>!m.correct).length == 0
        },

        // when user decides where to insert a milestone
        insertMilestoneAt: function(index) {
            this.milestones.insert(index, this.currentMilestone)
            this.checkMilestones()
            this.getRandomMilestone()
        },

        // start and reset the game
        startGame: function() {
            this.milestones = []
            this.getRandomMilestone()
            this.gameRunning = true
        }

    },
    mounted: function() {

        // kick off everything
        this.startGame()

    }
})
