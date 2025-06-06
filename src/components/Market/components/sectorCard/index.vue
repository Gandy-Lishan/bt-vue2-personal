<!-- SectorPerformance/index.vue -->
<template>
 <div class="sector-performance">
   <h2 class="section-title">Sector Volume & Performance</h2>
   <div class="cards-container">
     <SectorCard
       v-for="sector in sectors"
       :key="sector.id"
       :title="sector.title"
       :region="sector.region"
       :total-premium="sector.totalPremium"
       :country-risk="sector.countryRisk"
     />
   </div>
 </div>
</template>

<script>
import SectorCard from './SectorCard.vue'

export default {
 name: 'SectorPerformance',
 components: {
   SectorCard
 },
 data() {
   return {
     sectors: [
       {
         id: 1,
         title: 'China',
         region: 'Asia',
         totalPremium: 5.27,
         countryRisk: 0.94
       },
       {
         id: 2,
         title: 'China',
         region: 'Asia',
         totalPremium: 5.27,
         countryRisk: 0.94
       },
       {
         id: 3,
         title: 'China',
         region: 'Asia',
         totalPremium: 5.27,
         countryRisk: 0.94
       },
       {
         id: 4,
         title: 'China',
         region: 'Asia',
         totalPremium: 5.27,
         countryRisk: 0.94
       }
     ]
   }
 }
}
</script>

<style scoped>
.sector-performance {
 padding: 20px;
}

.section-title {
 font-size: 20px;
 font-weight: 600;
 color: #333;
 margin-bottom: 20px;
}

.cards-container {
 display: grid;
 grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
 gap: 20px;
}

@media (max-width: 768px) {
 .cards-container {
   grid-template-columns: 1fr;
 }
}
</style> 