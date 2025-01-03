const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            currentSection: "homepage",
            isAuthenticated: false,
            fail: false,
            success: false,
            wrongInput: false,

            signinData: {
                username: "",
                password: ""
            },
            registrationData: {
                name: "",
                surname: "",
                username: "",
                password: ""
            },
            auctionData: {
                title: "",
                description: "",
                closingDatetime: "",
                initialValue: null
            },

            title_details: "",
            title_details_m: "",
            date_details: "",
            
            auction_list: [],
            auction_info: {},
            users_list: [],
            user_info: {},
            auctions_won: [],

            whoamiauctions: [],
            whoamime: {},

            bids_list: [],
            bid_info: {},
            
            bidValue: null,
            id_auction_to_modify: null,

            expr: ""
        };
    },

    methods: {
        setSection(section, param) {
            this.resetFail();
            this.resetWrongInput();
            this.resetSuccess();
            this.expr = "";
            this.currentSection = section;
            if(section === "auctions") {
                this.showAuctions(); 
            }
            if(section === "auctiondetails") {
                this.showAuctions(param);
            }
            if(section === "community") {
                this.showCommunity();
            }
            if(section === "userdetails") {
                this.showCommunity(param);
            }
            if(section === "whoami") {
                this.showWhoami();
            }
            if(section === 'modify'){
                this.getId(param);
            }
        },

        resetSuccess() {
            this.success = false;
        },
        resetFail() {
            this.fail = false;
        },
        resetWrongInput(){
            this.wrongInput = false;
        },
        resetInputs() {
            this.auctionData.title = "";
            this.auctionData.description  = "";
            this.auctionData.closingDatetime = "";
            this.auctionData.initialValue = null;
            this.signinData.username = "";
            this.signinData.password = "";
            this.registrationData.name = "";
            this.registrationData.surname = "";
            this.registrationData.username = "";
            this.registrationData.password = "";
        },

        isActive(date) {
            const d = new Date(date);
            return d > new Date();
        },

        getLastBid(bids) {
            if (bids && bids.length > 0) {
                return bids.reduce((maxBid, bid) => (bid.value > maxBid.value ? bid : maxBid), bids[0]);
            }
            return "Non ci sono ancora offerte";
        },

        getId(id) {
            this.id_auction_to_modify = id;
        },

        async showAuctions(id = null) {
            let url = '/api/auctions';
            const query = this.expr;
            if(query !== null) {
                url = `/api/auctions?q=${query}`;
            }
            if(id !== null) {
                url = `/api/auctions/${id}`;
            }
            try {
                const response = await fetch(url, {
                    method: "get",
                    headers: { "content-type": "application/json" }
                });
                if(response.status === 200) {
                    const data = await response.json();
                    if(id === null) {
                        this.auction_list = data;
                        this.expr = "";
                    } else {
                        this.auction_info = data;
                        this.auction_info.currentBid = this.getLastBid(data.bids).value;
                        if(!this.isActive(data.closingDate)) {
                            this.auction_info.userId = this.getLastBid(data.bids).userId;
                            this.auction_info.winner = this.getLastBid(data.bids).username;
                        }
                    }
                } else if(response.status === 404) {
                    this.fail = true;
                } else {
                    console.log("Internal error");
                }  
            } catch(error) {
                console.log(error);
            }  
        },

        async handleNewAuction() {
            try {
                const closingDate = new Date(this.auctionData.closingDatetime).toISOString();
                const response = await fetch("/api/auctions", {
                    method: "post",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        title: this.auctionData.title,
                        description: this.auctionData.description,
                        closingDate: closingDate,
                        initialValue: this.auctionData.initialValue
                    })
                });
                if(response.status === 200){
                    this.success = true;
                    setTimeout(() => {
                        this.setSection("whoami");
                        this.resetSuccess();
                        this.resetInputs();
                    }, 1500);
                } else if(response.status === 406){
                    this.fail = true;
                    this.auctionData.closingDatetime = "";
                } else if(response.status === 400){
                    this.wrongInput = true;
                    this.auctionData.initialValue = "";
                } else {
                    console.log("Internal error");
                }  
            } catch(error) {
                console.log("Error", error);
            }  
        },

        async modifyAuction() {
            const id = this.id_auction_to_modify;
            const url = `/api/auctions/${id}`;
            try {
                const response = await fetch(url, {
                    method: "put",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        title: this.auctionData.title,
                        description: this.auctionData.description
                    })
                });
                if(response.status === 200) {
                    this.success = true;
                    setTimeout(() => {
                        this.setSection("whoami");
                        this.resetSuccess();
                        this.resetInputs();
                    }, 1500);
                } else {
                    console.log("Internal error.", await response.json());
                }  
            } catch(error) {
                console.log("Error", error);
            }  
        },
        
        async deleteAuction(id) {
            const url = `/api/auctions/${id}`;
            try {
                const response = await fetch(url, {
                    method: "delete",
                    headers: { "content-type": "application/json" }
                });
                if(response.status === 200) {
                    this.setSection('whoami');
                } else {
                    console.log("Error.", await response.json());
                }  
            } catch(error) {
                console.log(error);
            }  
        },

        async showCommunity(id = null) {
            let url = '/api/users';
            const query = this.expr;
            if(query !== null) {
                url = `/api/users?q=${query}`;
            }
            if(id !== null) {
                url = `/api/users/${id}`;
            }
            try {
                const response = await fetch(url, {
                    method: "get",
                    headers: { "content-type": "application/json" }
                });
                if(response.status === 200) {
                    const data = await response.json();
                    if(id === null) {
                        this.users_list = data;
                        this.expr = "";
                    } else {
                        this.user_info = data.requested_user;
                        this.auctions_won = data.won_auctions;
                    }
                } else if(response.status === 404) {
                    this.fail = true;
                } else {
                    console.log("Internal error");
                }  
            } catch(error) {
                console.log(error);
            }  
        },

        async handleSignin() {
            try {
                const response = await fetch("/api/auth/signin", {
                    method: "post",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        username: this.signinData.username,
                        password: this.signinData.password
                    })
                });
                if(response.status === 200) {
                    this.success = true;
                    setTimeout(() => {
                        this.isAuthenticated = true;
                        this.setSection("homepage");
                        this.resetSuccess();
                    }, 1000);
                } else if(response.status === 400) {
                    this.fail = true;
                    this.resetInputs();
                } else {
                    console.log("Internal error");
                }
            } catch(error) {
                console.log(error);
            }
        },

        async handleSignup() {
            try {
                const response = await fetch("/api/auth/signup", {
                    method: "post",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        name: this.registrationData.name,
                        surname: this.registrationData.surname,
                        username: this.registrationData.username,
                        password: this.registrationData.password
                    })
                });
                if(response.status === 200) {
                    this.success = true;
                    setTimeout(() => {
                        this.isAuthenticated = true;
                        this.setSection("homepage");
                        this.resetSuccess();
                    }, 1000);
                    this.resetInputs();
                } else if(response.status === 409) {
                    this.wrongInput = true;
                } else {
                    console.log("Internal error");
                }  
            } catch(error) {
                console.log(error);
            }  
        },

        handleLogout() {
            this.isAuthenticated = false;
            this.setSection("homepage");
            this.success = true;
            setTimeout(() => {
                this.resetSuccess();
            }, 2000);
            this.resetInputs();
        },

        async showWhoami() {
            try {
                const response = await fetch("/api/whoami", {
                    method: "get",
                    headers: { "content-type": "application/json" }
                });
                const data = await response.json();
                if(response.status === 200) {
                    this.whoamime = data.myself;
                    this.whoamiauctions = data.myAuctions;
                    this.whoamiauctions.forEach(item => {
                        const b = this.getLastBid(item.bids);
                        item.currentBid = b ? b.value : 0; 
                        if(!this.isActive(item.closingDate)) {
                            item.gain = b ? b.value : 0;
                        }
                    });
                } else {
                    console.log("Error.", data);
                }  
            } catch(error){
                console.log(error);
            }  
        },

        async showBids(id, title, date) {
            this.setSection('offer');
            this.title_details = title;
            this.auction_id = id;
            this.date_details = date;
            const url = `/api/auctions/${id}/bids`
            try {
                const response = await fetch(url, {
                    method: "get",
                    headers: { "content-type": "application/json" }
                });
                const data = await response.json();
                if(response.status === 200) {
                    this.bids_list = data;
                } else {
                    console.log("Error.", data);
                }  
            } catch(error){
                console.log(error);
            }  
        },

        async showBidDetails(id) {
            const auc_id = this.auction_id;
            const url = `/api/bids/${id}?auc_id=${auc_id}`
            try {
                const response = await fetch(url, {
                    method: "get",
                    headers: { "content-type": "application/json" }
                });
                const data = await response.json();
                if(response.status === 200) {
                    this.bid_info = data;
                } else {
                    console.log("Error.", data);
                }  
            } catch(error){
                console.log(error);
            }  
        },

        async handleNewBid() {
            const id = this.auction_id;
            const title = this.title_details;
            const url = `/api/auctions/${id}/bids`;
            try {
                const response = await fetch(url, {
                    method: "post",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        submittedValue: this.bidValue,
                    })
                });  
                if(response.status === 200) {
                    this.success = true;
                    setTimeout(() => {
                        this.showBids(id, title);
                        this.resetSuccess();
                        this.bidValue = null;
                    }, 1000);
                } else if(response.status === 409) {
                    this.fail = true;
                } else if(response.status === 400){
                    this.wrongInput = true;
                } else {
                    console.log("Error.", await response.json());
                }  
            } catch(error){
                console.log(error);
            }
        }
    }
});

app.mount('#app');

