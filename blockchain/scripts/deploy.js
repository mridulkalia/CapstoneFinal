const { ethers } = require('hardhat')
// 0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0
async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000)
  const unlockTime = currentTimestampInSeconds + 60

  const lockedAmount = ethers.parseEther('0.001')

  const CrowdFunding = await ethers.getContractFactory('CrowdFunding')
  const crowdFunding = await CrowdFunding.deploy()

  await crowdFunding.waitForDeployment()

  console.log(`CrowdFunding deployed to ${crowdFunding.address}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
