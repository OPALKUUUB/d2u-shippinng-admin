import SignInForm from "../../../components/SignInForm"

function SignInPage() {
   return (
      <div className="w-screen h-screen flex justify-center items-center">
         <div className="w-[350px] sm:w-[400px] -mt-10">
            <h2 className="font-black">
               <i className="bx bxs-lock" />
               SIGN IN&nbsp;<span>(D2U-ADMIN)</span>
            </h2>
            <SignInForm />
         </div>
      </div>
   )
}

export default SignInPage
