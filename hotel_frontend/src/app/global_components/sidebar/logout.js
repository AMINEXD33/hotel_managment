import { useRouter } from "next/router";
import { API_logout } from "../../../../endpoints/endpoints";
export default function Logout(router){
    fetch(API_logout(), {})
    .then()
    .finally(
        router.push("/loginPage")
    )

}