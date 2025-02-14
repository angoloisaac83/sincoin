import { Link } from 'react-router-dom';
const Onboarding = ()=>{

    return(
        <>
            <main className="w-full text-center h-screen text-black bg-white flex flex-col items-center justify-between">
                <img className='h-[50vh] object-cover w-full' src="https://i.pinimg.com/736x/c6/51/21/c651218a6c17efc7fb2cf237eb68bf9c.jpg" alt="" />
                <div className='w-full py-[10px] h-[40vh] px-4 flex flex-col items-center gap-4 justify-center'>
                    <h1 className="text-4xl font-bold text-green-600 w-full">Begin your Mining journey with Sin Coin</h1>
                    <p>Register or Login</p>
                    <p>Click on start mining</p>
                    <p>Complete Daily tasks and claim rewards</p>
                    <p>Participate in airdrops and wait for Launch Date</p>
                    <Link to="/register"><button className='text-white bg-green-600 text-2xl rounded-full px-[30px] py-[8px]'>Get Mining</button></Link>
                </div>
            </main>
        </>
    )
}

export default Onboarding;
