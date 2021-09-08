import { Injectable } from '@angular/core';
import { MichelsonMap, TezosToolkit} from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType } from "@airgap/beacon-sdk";
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import { Base64 } from 'js-base64';

@Injectable({
  providedIn: 'root',
})
export class TaquitoService {
    private taquito: TezosToolkit = new TezosToolkit('https://florencenet.smartpy.io/');
    private wallet;
    private contract_address = "KT1VoXdrw4kfzYaoEyEbcxEm25DaDXxaH5xf";
    private storage = undefined;
    private contract = undefined;
    constructor() {}
    
    public async set_contract() {
        // if(this.storage == undefined) 
        // {
            this.contract = await this.taquito.wallet.at(this.contract_address);
            this.storage = await this.contract.storage();
        // }
    }
    

    public async connect_wallet() {
        this.wallet = new BeaconWallet({ name: 'test' });
        await this.wallet.requestPermissions({
            network: {  
                type: NetworkType.FLORENCENET
            }
        });
        this.taquito.setProvider({ wallet: this.wallet });    
        return true;
    }

    public async get_uxp(uuid):Promise<number>
    {
        if(this.storage == undefined)this.storage = await this.contract.storage();
        var num = await this.storage.users.get(uuid).user_xp;
        return num;
    }

    public async get_oxp(uuid):Promise<number>
    {
        if(this.storage == undefined)this.storage = await this.contract.storage();
        var num = await this.storage.users.get(uuid).org_xp;
        return num;
    }

    public async get_pics(puid):Promise<Array<string>>
    {
        if(this.storage == undefined)this.storage = await this.contract.storage();
        var pics =  this.storage.posts.get(puid).pictures;
        for(let i = 0;i<pics.length;i++)
        {
            pics[i] = "https://ipfs.io/ipfs/" + pics[i];
            console.log(pics[i]);
        }
        return pics;
    }

    public async get_specific_from_transactions(uuid):Promise<Array<object>> {        
        if(this.storage == undefined)this.storage = await this.contract.storage();
        var tlist:{}[] = [];
        var i = 1;
        this.storage.transactions.get(uuid).forEach((val: any, key: string) => {
            tlist.push({data : {
                Type : this.storage.posts.get(val.to_puid).name,
                Amount : (Math.floor(val.amount.c[0]/100000)/10).toString(),
                kind : 'doc',
                puid : val.to_puid,
                transid : val.transid
                }});
            i+=1;
        });
        return tlist;
    }

    public async get_specific_to_transactions(uuid):Promise<Array<object>> {
        if(this.storage == undefined)this.storage = await this.contract.storage();
        var tlist:{}[] = [];
        var i = 0;
        var post_list = this.storage.users.get(uuid).posts;
        while(i<post_list.length)
        {
            this.storage.transactions.get(post_list[i]).forEach((val: any, key: string) => {
                tlist.push({data : {
                    Type : this.storage.posts.get(val.to_puid).name,
                    Amount : (Math.floor(val.amount.c[0]/100000)/10).toString(),
                    kind : 'doc',
                    puid : val.to_puid,
                    transid : val.transid
                    }});
            });
            i+=1;
        }
        return tlist;
    }
    public async get_specific_post_transactions(puid):Promise<Array<object>> {
        if(this.storage == undefined)this.storage = await this.contract.storage();
        var tlist:{}[] = [];
        var i = 1;
        this.storage.transactions.get(puid).forEach((val: any, key: string) => {
            tlist.push({data : {
                Type : this.storage.posts.get(val.to_puid).name,
                Amount : val.amount.c[0].toString(),
                kind : 'doc'
                }});
            i+=1;
        });
        return tlist;
    }
    
    public async get_all_transactions():Promise<object> {
        if(this.storage == undefined)this.storage = await this.contract.storage();
        const transactions_list: { uuid: string; transaction: number }[] = [];
        this.storage.transactions.forEach((val: number, key: string) => {
            transactions_list.push({ uuid: key, transaction: val });
        });
        console.log(transactions_list[0]);
        return transactions_list;
    }


    public async graph()
    {
        var month_list:any = [450,23,190,100,190,300,100,990,100,200,500,90];
        var curr_date = new Date();
        const curr_month = curr_date.getMonth() + 1;    
        const curr_year = curr_date.getFullYear();
        
        
        if(this.storage == undefined)this.storage = await this.contract.storage();
        this.storage.transactions.forEach((val: any, key: string) => {
            val.forEach(element => {
                const trans_month = parseInt(element.timestamp.substring(5,7));
                const trans_year = parseInt(element.timestamp.substring(0,5));

                if(curr_month > trans_month && curr_year == trans_year)
                {
                    month_list[trans_month-1 +12-curr_month] += (Math.floor(element.amount.c[0]/100000)/10)
                }
                else if(curr_month == trans_month && curr_year == trans_year)
                {
                    month_list[11] += (Math.floor(element.amount.c[0]/100000)/10)
                }
                else if(curr_month < trans_month && curr_year == trans_year + 1)
                {
                    month_list[trans_month-1 -12 + curr_month] += (Math.floor(element.amount.c[0]/100000)/10);
                }
            });
        });
        for(let i = 0;i<12;i++)
        {
            month_list[i] = month_list[i]/2;
        }
        return month_list;
    }

    //get user
    public async get_user(uuid):Promise<object> {
        if(this.storage == undefined)this.storage = await this.contract.storage();
        console.log(this.storage.users.get(uuid));
        return this.storage.users.get(uuid);
    }
    // get post
    public async get_post(puid):Promise<object>{
        if(this.storage == undefined)this.storage = await this.contract.storage();
        // console.log(this.storage.posts.get(puid));
        return this.storage.posts.get(puid);
    }

    public async get_specific_post_type(type):Promise<Array<object>>{
        if(this.storage == undefined)this.storage = await this.contract.storage();
        var plist = [];
        this.storage.posts.forEach((val: any, key: string) => {
            if(val.post_type == type)
            {
                plist.push({
                    name : val.name,
                    id : key,
                    description : val.description,
                    progress : Math.floor((val.received_mutez.c/val.goal.c)*100),
                    pic :"https://ipfs.io/ipfs/" + val.pictures[0],
                    goal : Math.floor(val.goal/1000000),
                    deadline : val.deadline,
                    locked_funds : val.locked_fund
                });
            }
        });
        return plist;
    }

    // get total fund
    public async get_total_fund():Promise<number>{
        if(this.storage == undefined)this.storage = await this.contract.storage();
        // console.log(this.storage.transactions);
        return Math.ceil(this.storage.total_fund/1000000);
    }

    public async get_specific_locked_fund(puid):Promise<number>{
        if(this.storage == undefined)this.storage = await this.contract.storage();
        // console.log(this.storage.transactions);
        return this.storage.posts.get(puid).locked_fund;
    }

    public async get_total_locked_fund():Promise<number>{
        if(this.storage == undefined)this.storage = await this.contract.storage();
        // console.log(this.storage.transactions);
        return this.storage.locked_funds;
    }
    // get total donors
    public async get_total_donors():Promise<number>{
        if(this.storage == undefined)this.storage = await this.contract.storage();
        // console.log(this.storage.transactions);
        return this.storage.total_donors;
    }
    // get total fundings
    public async get_total_fundings():Promise<number>{
        if(this.storage == undefined)this.storage = await this.contract.storage();
        // console.log(this.storage.transactions.size);
        return this.storage.transactions.size;
    }
    // get total goals reached
    public async get_goals_reached():Promise<number>{
        if(this.storage == undefined) this.storage = await this.contract.storage();
        // console.log(this.storage.total_goals_reached.c);
        return this.storage.total_goals_reached.c;
    }
    
    //get number of posts
    public async get_number_posts():Promise<number>{
        if(this.storage == undefined)this.storage = await this.contract.storage();
        // console.log(this.storage.posts.size);
        return this.storage.posts.size;
    }
    //get weekly fundings

    //set vote

    //Send anyway (transaction)

    //XP for each user.

    //set verifaction.

    public async get_posts_of_user(uuid):Promise<Array<object>> {
        if(this.storage == undefined)this.storage = await this.contract.storage();
        let i = 0;
        let posts = [];
        let post_ids = this.storage.users.get(uuid).posts;
        while(i < this.storage.users.get(uuid).posts.length)
        {
            posts.push(this.storage.posts.get(post_ids[i])[0]);
            i++;
        }
        // console.log(posts);
        return posts;
    }
    
    public async get_all_posts():Promise<Array<Object>> {
        if(this.storage == undefined)this.storage = await this.contract.storage();
        const post_list: { name: string; id: string, puid : string,type: string, description : string }[] = [];
        var i = 1;
        this.storage.posts.forEach((val: any, key: string) => {
            post_list.push({
                name : val.name,
                id : i.toString(),
                puid : key,
                type : val.post_type,
                description : val.description,
                });
            i+=1;
        });
        return post_list;
    }

    public async get_total_users():Promise<number>{
        if(this.storage == undefined)this.storage = await this.contract.storage();
        // console.log(this.storage.users.size);
        return this.storage.users.size;
    }
    
    async check_new_user(email):Promise<Boolean>{
        if(this.storage == undefined)this.storage = await this.contract.storage();
        if(this.storage.users.get(Base64.encode(email,true))) return false;
        else return true;
    }

    public async send_fund(from_uuid, to_puid,send_amount,comment) {
        const userAddress = await this.wallet.getPKH();
        let flag = true
        if(this.storage == undefined)this.storage = await this.contract.storage();
        const len = this.storage.transactions.get(to_puid).length + 1;
        const trans_id = to_puid + parseInt(len);
        // try{
        //     const op = await this.taquito.wallet
        //     .transfer({to: this.storage.posts.get(to_puid).address , amount : send_amount ,mutez: true})
        //     .send();
        //     await op.confirmation();
        // }
        // catch(err)
        // {
        //     flag = false;
        //     console.log(err);
        // }
        // if(flag)
        // {
            const op2 = await this.contract.methods
            .add_transaction1(send_amount,comment,userAddress,from_uuid,to_puid,trans_id)
            .send({amount :send_amount,mutez : true});
            await op2.confirmation();
        // }
    }

    public async send_fund_to_contract(from_uuid, to_puid,send_amount,comment, downvotes) {
        const userAddress = await this.wallet.getPKH();
        let flag = true
        
        if(this.storage == undefined)this.storage = await this.contract.storage();
        const len = this.storage.transactions.get(to_puid).length + 1;
        const trans_id = to_puid + parseInt(len);

        const op = await this.contract.methods
        .add_transaction2(send_amount,comment,downvotes,userAddress,from_uuid,to_puid,trans_id)
        .send({ amount: send_amount, mutez: true});
        await op.confirmation();
    }

    public async add_new_user(email) {
        const op = await this.contract.methods
        .add_user(email,Base64.encode(email,true))
        .send();
        await op.confirmation();
    }

    public async add_new_post(name,description,institution,post_type,uuid,goal,images,deadline) {
        const userAddress = await this.wallet.getPKH();
        if(this.storage == undefined) this.storage = this.contract.storage();
        
        const len = await this.storage.users.get(uuid).posts.length;
        const posts = await this.storage.users.get(uuid);
        var email = atob(uuid);
        const puid = Base64.encode(email+ len.toString(),true);
        // console.log(typeof(images));
        
        const op = await this.contract.methods
        .add_post(userAddress,deadline,description,goal,institution,name,images,post_type,puid,uuid)
        .send();
        await op.confirmation();
    }

    // Check Support
    public async check_support(uuid,puid):Promise<boolean>
    {
        if(this.storage == undefined) this.storage = this.contract.storage();
        const uplist = this.storage.posts.get(puid).upvotes
        const downlist = this.storage.posts.get(puid).downvotes
        for(let i = 0;i<uplist.length;i++)
        {
            if(uplist[i] == uuid) return true;
        }
        for(let i = 0;i<downlist.length;i++)
        {
            if(downlist[i] == uuid) return true;
        }
        return false;
    }

    public async support(uuid,puid){
        const flag = await this.check_support(uuid,puid);
        if(flag == false)
        {
            const op = await this.contract.methods
            .support(puid,uuid)
            .send();
            await op.confirmation();
        } 
    }
    public async report(uuid,puid){
        const flag = await this.check_support(uuid,puid);
        if(flag == false)
        {
            const op = this.contract.methods
            .report(puid,uuid)
            .send();
            await op.confirmation();
        } 
    }
    
    // Check Reclaim
    // 0 : This fund can be reclaimed.    
    // 1 : This fund is not mature. Please wait until the deadline of the cause!
    // 2 : This fund was already sent to the organization.
    // 3 : Transaction not found.
    // 4 : Already claimed.
    public async check_reclaim(uuid,transid):Promise<number>
    {
        var posts = {};
        await this.storage.posts.forEach((val: any, key: string) => {
            posts[key] = val;
        });
        
        var curr_date = new Date();
        if(this.storage == undefined) this.storage = this.contract.storage();        
        var flag = 3;
        
        await this.storage.transactions.get(uuid).forEach((val: any, key: string) => {
            if(val.transid == transid)
            {   
                if(val.type.c[0] == 1) flag = 4;
                else{
                    console.log(posts[val.to_puid].deadline);
                    console.log(posts[val.to_puid].deadline <=  curr_date);
                    if(posts[val.to_puid].deadline <=  curr_date.getDate())
                    {   
                        if(posts[val.to_puid].downvotes.length >= val.downvotes)
                        {
                            if(val.claimable == 1) flag = 0;
                            else flag = 4;
                        }
                        else flag = 2;
                    }
                    else if(posts[val.to_puid].downvotes.length >= val.downvotes)
                    {
                        flag = 0;
                    }
                    else flag =  1;
                }
            }
        });
        return flag;
    }
    
    // Check Claim
    // 0 : This fund can be claimed.    
    // 1 : This fund is not mature. Please wait until the deadline of the cause!
    // 2 : This fund cannot be claimed as the donor set a low downvote threshold.
    // 3 : Transaction not found.
    // 4 : Already claimed.
    public async check_claim(puid,transid):Promise<number>
    {
        var posts = {};
        await this.storage.posts.forEach((val: any, key: string) => {
            posts[key] = val;
        });
        
        var curr_date = new Date();
        if(this.storage == undefined) this.storage = this.contract.storage();        
        var flag = 3;
        await this.storage.transactions.get(puid).forEach((val: any, key: string) => {
            if(val.transid == transid)
            {
                if(val.type == 1) flag = 2;
                else{
                    var d1 = new Date(posts[val.to_puid].deadline);
                    var d2 = new Date(curr_date)
                    var dt1 = d1.getTime()/1000;
                    var dt2 = d2.getTime()/1000;
                    if(dt1 <= dt2)
                    {
                        if(posts[val.to_puid].downvotes.length < val.downvotes)
                        {
                            // return 0;
                            if(val.claimable == 1) flag = 0;
                            else flag = 4;
                        }
                        else flag = 2;
                    }
                    else if(posts[val.to_puid].downvotes.length >= val.downvotes)
                    {
                        flag = 2;
                    }
                    else flag = 1;
                }
            }
        });
        return flag;
    }

    public async reclaim_fund(puid,uuid,transid){
        const userAddress = await this.wallet.getPKH();
        const flag = await this.check_reclaim(uuid,transid);
        console.log(flag);
        if(flag == 0){
            const op = await this.contract.methods
            .reclaim(userAddress,puid,transid,uuid)
            .send();
            await op.confirmation();
        }
    }

    public async claim_fund(puid,uuid,transid){
        const flag = await this.check_claim(puid,transid);
        if(flag == 0){
            const op = await this.contract.methods
            .claim(puid,transid,uuid)
            .send();
            await op.confirmation();
        }
    }

    public async is_connected():Promise<boolean>
    {
        let activeAccount;
        if(this.wallet) activeAccount = await this.wallet.client.getActiveAccount();
        else return false;
        if(activeAccount) 
        {
            console.log(activeAccount.address);
            return true;
        }
        else return false;
    }

    public async disconnect_wallet(){
        if(this.wallet)
        {   
            this.wallet.client.destroy();
            this.wallet = undefined;
        }
    };
}