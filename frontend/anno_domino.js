Array.prototype.insert = function ( index, item ) {
    this.splice( index, 0, item );
};

// where the API sits
const API_URL = "https://die-leugers.de:8081"

// bypass api for DEV purposes
const BYPASS_API = true

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
            this.insertMilestoneAt(0)
            this.gameRunning = true
        }

    },
    mounted: function() {

        // kick off everything
        this.startGame()

    }
})
