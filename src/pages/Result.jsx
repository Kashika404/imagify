// import React, { useState } from 'react'
// import { assets } from '../assets/assets'
// import {motion} from "framer-motion"

// const Result = () => {
//   const [image,setImage]=useState(assets.sample_img_1)
//   const [isImageLoaded,setIsImageLoaded]=useState(false);
//   const [loading,setLoading]=useState(false );
//   const [input,setInput]=useState('')

//   const onSubmitHandler =async(e)=>{
    
//   }

//   return (
//     <motion.form
//     initial={{opacity:0.2,y:100}}
//     transition={{duration:1}}
//     whileInView={{opacity:1,y:0}}
//     viewport={{once:true}}
//     onSubmit={onSubmitHandler} className='flex flex-col min-h-[90vh] justify-center items-center'>
//     <div>
//       <div className='relative'>
//         <img src={image} className='max-w-sm rounded'/>
//         <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${ loading? 'w-full transition-all duration-[10s]' : 'w-0'}`}/>
//       </div>

//       <p className={!loading?'hidden' : ''}>Loading.....</p> 
      
//     </div>
//       {!isImageLoaded&&
//     <div className='flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full'>
//       <input onChange={e=>setInput(e.target.value)} value={input}
//        type="text" placeholder='Describe what you want to generate'  className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color'/>
//       <button type='submit' className='bg-zinc-900 px-10 sm:px-16 py-3 rounded-full'>Generate</button>
//     </div>
//     }
//     {isImageLoaded && 
//     <div className='flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full'>
//       <p onClick={()=>{setIsImageLoaded(false)}}  className='bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer'>Generate Another</p>
//       <a href={image} download className='bg-zinc- 900  px-10 py-3 rounded-full cursor-pointer'>Download</a> 
//     </div>
// } 
 
//     </motion.form>
//   )
// }
  
// export default Result




import React, { useState, useContext } from 'react'; // Added useContext
import { assets } from '../assets/assets';
import { motion } from "framer-motion";
import { AppContext } from '../context/AppContext'; // Import AppContext
import axios from 'axios'; // Import axios
import { toast } from 'react-toastify'; // Optional: for error notifications

const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');

  const { backendUrl, token, user, setShowLogin } = useContext(AppContext); // Get context values

  const onSubmitHandler = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!input.trim()) {
      toast.error("Please enter a prompt.");
      return;
    }

    if (!user) {
      setShowLogin(true); // If user is not logged in, show login popup
      toast.error("Please log in to generate images.");
      return;
    }

    setLoading(true);
    setIsImageLoaded(false); // Reset image loaded state
    setImage(assets.sample_img_1); // Reset to default or a placeholder

    try {
      const response = await axios.post(
        `${backendUrl}/api/image/generate-image`,
        { prompt: input },
        {
          headers: {
            token: `${token}`, // Send token in headers as expected by auth.js
          },
        }
      );

      if (response.data.sucess) { // 'sucess' is used in your backend
        setImage(response.data.resultImage);
        setIsImageLoaded(true);
        toast.success(response.data.message || "Image generated successfully!");
        // You might want to update credit balance display if possible
      } else {
        toast.error(response.data.message || "Failed to generate image.");
        if (response.data.message === 'No Credit Balance') {
          // Handle no credit scenario, e.g., navigate to buy credits page
        }
      }
    } catch (error) {
      console.error("Image generation error:", error);
      toast.error(error.response?.data?.message || error.message || "An error occurred during image generation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={onSubmitHandler} className='flex flex-col min-h-[90vh] justify-center items-center'
    >
      <div>
        <div className='relative'>
          <img src={image} className='max-w-sm rounded' alt={isImageLoaded ? input : "Sample image"}/>
          <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'}`} />
        </div>
        <p className={!loading ? 'hidden' : 'text-center mt-2'}>Loading.....</p>
      </div>
      {!isImageLoaded && !loading && ( // Also hide input form if loading
        <div className='flex w-full max-w-xl bg-neutral-100 text-black border border-gray-300 text-sm p-0.5 mt-10 rounded-full shadow-md'>
          <input
            onChange={e => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder='Describe what you want to generate'
            className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-gray-500'
            disabled={loading} // Disable input when loading
          />
          <button
            type='submit'
            className='bg-zinc-900 text-white px-10 sm:px-16 py-3 rounded-full hover:bg-zinc-700 transition-colors'
            disabled={loading} // Disable button when loading
          >
            Generate
          </button>
        </div>
      )}
      {isImageLoaded && !loading && (
        <div className='flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full'>
          <button // Changed to button for consistency
            onClick={() => {
              setIsImageLoaded(false);
              setInput(''); // Optionally clear the input
              setImage(assets.sample_img_1); // Reset to default image
            }}
            className='bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer hover:bg-gray-100 transition-colors'
          >
            Generate Another
          </button>
          <a
            href={image}
            download={input.replace(/\s+/g, '_') || "generated_image.png"} // Create a dynamic filename
            className='bg-zinc-900 text-white px-10 py-3 rounded-full cursor-pointer hover:bg-zinc-700 transition-colors'
          >
            Download
          </a>
        </div>
      )}
    </motion.form>
  );
}

export default Result;