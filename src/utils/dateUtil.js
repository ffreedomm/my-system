export function formatDate(dateString) {
    if(dateString != null && dateString!=""){
        var ss = dateString.split("-");
        return ss[0]+"-"+ss[1]+"-"+ss[2]+" "+ss[3]+":"+ss[4]
    }else{
    return "";
    }
};