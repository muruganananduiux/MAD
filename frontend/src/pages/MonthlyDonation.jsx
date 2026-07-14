import { toast } from "sonner";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  ShieldCheck,
  CalendarDays,
  CheckCircle
} from "lucide-react";

const AMOUNTS = [500, 1000, 2500, 5000];

const PLEDGES = [
  {
    title: "Medical Emergency Support",
    text: "We pledge to bring hope during emergencies."
  },
  {
    title: "Food Support",
    text: "We pledge to fight hunger and spread kindness."
  },
  {
    title: "Cancer Support",
    text: "We pledge to stand with cancer warriors."
  },
  {
    title: "Children Support",
    text: "We pledge to build a brighter future for children."
  },
  {
    title: "Shelter Support",
    text: "We pledge to provide care and comfort."
  }
];

export default function MonthlyDonation() {

const nav = useNavigate();

const [amount,setAmount]=useState(1000);
const [agree, setAgree] = useState(false);
const [donor,setDonor]=useState({
name:"",
email:"",
phone:""
});

return(

<div className="max-w-7xl mx-auto px-6 py-12">

<div className="grid lg:grid-cols-2 gap-10">

{/* LEFT */}

<div>

<div className="section-eyebrow">
Monthly Giving
</div>

<h1 className="font-serif text-5xl leading-tight mt-3">
Become a
<span className="text-[#EF6A3D]"> Monthly Hero.</span>
</h1>

<p className="mt-4 text-[#4a4a44] leading-7">
Your monthly contribution helps us provide continuous
medical care, food, education and emergency support to
families across India.
</p>

<div className="grid grid-cols-4 gap-3 mt-8">

{AMOUNTS.map((item)=>(

<button

key={item}

onClick={()=>setAmount(item)}

className={`rounded-full py-3 font-semibold border transition

${amount===item ?

"bg-[#EF6A3D] text-white border-[#EF6A3D]"

:

"border-[#E7DFCF] hover:border-[#EF6A3D]"

}

`}

>

₹{item}

</button>

))}

</div>

<input

type="number"

value={amount}

onChange={(e)=>setAmount(Number(e.target.value))}

placeholder="Custom Amount"

className="w-full mt-5 px-4 py-3 border border-[#E7DFCF] rounded-lg"

/>

<input

placeholder="Full Name"

value={donor.name}

onChange={(e)=>setDonor({...donor,name:e.target.value})}

className="w-full mt-4 px-4 py-3 border border-[#E7DFCF] rounded-lg"

/>

<input

placeholder="Email"

value={donor.email}

onChange={(e)=>setDonor({...donor,email:e.target.value})}

className="w-full mt-4 px-4 py-3 border border-[#E7DFCF] rounded-lg"

/>

<input

placeholder="Phone"

value={donor.phone}

onChange={(e)=>setDonor({...donor,phone:e.target.value})}

className="w-full mt-4 px-4 py-3 border border-[#E7DFCF] rounded-lg"

/><label className="flex items-center gap-2 mt-5 text-[14px] text-[#4a4a44]">
  <input
  type="checkbox"
  checked={agree}
  onChange={(e)=>setAgree(e.target.checked)}
/>
  I agree to make this a recurring monthly donation.
</label>

<div className="mt-6 bg-[#F8F5EF] border border-[#E7DFCF] rounded-xl p-5">

  <div className="flex items-center gap-2 font-semibold">
    <ShieldCheck size={18}/>
    Why Monthly Giving?
  </div>

  <div className="grid grid-cols-2 gap-4 mt-4 text-[14px]">

    <div className="flex items-center gap-2">
      <CheckCircle size={16} className="text-[#2F6E5B]" />
      80G Tax Benefit
    </div>

    <div className="flex items-center gap-2">
      <CheckCircle size={16} className="text-[#2F6E5B]" />
      Cancel Anytime
    </div>

    <div className="flex items-center gap-2">
      <CheckCircle size={16} className="text-[#2F6E5B]" />
      Secure Payments
    </div>

    <div className="flex items-center gap-2">
      <CheckCircle size={16} className="text-[#2F6E5B]" />
      Trusted NGO
    </div>

  </div>

</div>

<button

onClick={()=>{
if(!agree){
   toast.error("Please accept the monthly donation agreement.");
   return;
}
if(!donor.name.trim()){
   toast.error("Please enter your full name.");
   return;
}
if(!donor.email.trim()){
   toast.error("Please enter your email address.");
   return;
}
const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!emailRegex.test(donor.email)){
   toast.error("Please enter a valid email.");
   return;
}
if(!donor.phone.trim()){
   toast.error("Please enter your phone number.");
   return;
}
if(donor.phone.length!==10){
   toast.error("Phone number must be 10 digits.");
   return;
}
if(amount<100){
   toast.error("Minimum monthly donation is ₹100.");
   return;
}
localStorage.setItem(

"mad_pending_donation",

JSON.stringify({

campaignId:"monthly",

campaignTitle:"Monthly Donation",

amount,

donor,

monthly:true,

timestamp:Date.now()

})

);

nav("/payment");

}}

className="btn-orange w-full justify-center mt-7 !py-3"

>

<Heart size={18}/>

Proceed to Payment

</button>

</div>

{/* RIGHT */}

<div>

<div className="sticky top-24">

<h2 className="font-serif text-3xl mb-6">

Your Monthly Promise ❤️

</h2>

<div className="space-y-4">

{PLEDGES.map((item)=>(

<div

key={item.title}

className="bg-white border border-[#E7DFCF] rounded-xl p-5 hover:border-[#EF6A3D] transition"

>

<div className="text-xl">

{item.icon}

</div>

<h3 className="font-semibold mt-2">

{item.title}

</h3>

<p className="text-[#4a4a44] text-[14px] mt-2">

{item.text}

</p>

</div>

))}

</div>

<div className="bg-[#2F6E5B] rounded-xl p-6 text-white mt-8">

<div className="flex items-center gap-2">

<CalendarDays size={18}/>

Monthly Impact

</div>

<div className="mt-4 space-y-3 text-[14px]">

<div>₹500 → Medicines for children</div>

<div>₹1000 → Food for a family</div>

<div>₹2500 → Emergency medical support</div>

<div>₹5000 → Shelter & education</div>

</div>

</div>

</div>

</div>

</div>

</div>

);

}