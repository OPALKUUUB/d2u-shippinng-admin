import { Fragment } from "react"
import { getSession } from "next-auth/react"
import SignInForm from "../../../components/SignInForm"

function SignInPage() {
   return (
      <Fragment>
         <div className="container">
            <div className="card">
               <h2 className="header-1">
                  <i className="bx bxs-lock" />
                  SIGN IN<span>(D2U-ADMIN)</span>
               </h2>
               <SignInForm />
            </div>
         </div>
         <style jsx>
            {`
               .container {
                  background: rgba(0, 0, 0, 0.1);
                  width: 100vw;
                  height: 100vh;
                  display: flex;
                  justify-content: center;
                  align-items: center;
               }
               .card {
                  background: #ffffff;
                  border-radius: 2px;
                  min-width: 300px;
                  min-height: 200px;
                  width: 350px;
                  height: 270px;
                  padding: 50px;
               }
               .header-1 {
                  font-size: 1.5rem;
                  margin-bottom: 0.75rem;
                  text-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
               }
               .header-1 > i {
                  padding: 0;
                  margin-right: 0.2rem;
                  font-size: 1.6rem;
               }
               .header-1 > span {
                  font-size: 1.3rem;
                  font-weight: 400;
               }
            `}
         </style>
      </Fragment>
   )
}

export async function getServerSideProps(context) {
   const session = await getSession({ req: context.req })

   if (session) {
      return {
         redirect: {
            destination: "/",
            permanent: false,
         },
      }
   }
   return {
      props: { session },
   }
}
export default SignInPage
