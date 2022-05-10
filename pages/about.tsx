import Nav from "../components/Nav"

const About = () => {
    return (
      <div className='max-w-7xl mx-auto'>
          <Nav />
          <div className="flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-0">
            <div className='px-10 space-y-5'>
               <h1 className='text-6xl font-serif max-w-xl'>
                  <span className='underline decoration-black decoration-2'>About</span></h1>
               <h3>On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.</h3>
            </div>

            
         </div>
      </div>
    )
}
  
export default About