<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <HeaderReturn
        :headerTitle="headerTitle"
        :headerColor="theme.primaryColor"
        :headerTextColor="theme.primaryFontColor"
      />
      <Refresher />

      <div class="search-container">
        <ion-input placeholder="Search Billers" class="search-bar">
          <ion-icon name="search-outline" class="search-icon"> </ion-icon>
        </ion-input>
      </div>

      <div class="bills-title">
        <h4 :style="{ color: theme.primaryColor }">Select your biller</h4>
      </div>
      <!--  -->
      <div class="biller-categories">
        <div class="biller-container" @click="navigatePayment()">
          <div class="img-container">
            <svg
              width="50"
              height="46"
              viewBox="0 0 50 46"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <rect width="50" height="46" rx="5" fill="url(#pattern0_5_459)" />
              <defs>
                <pattern
                  id="pattern0_5_459"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use
                    xlink:href="#image0_5_459"
                    transform="matrix(0.00502732 0 0 0.00546448 -0.191257 0)"
                  />
                </pattern>
                <image
                  id="image0_5_459"
                  width="275"
                  height="183"
                  xlink:href="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIPDw4NDw8PDQ0PDhAPDg4ODQ8PDw4RFxUWFhUWFRUZHiggGBsnGxUYIjEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGxAQGy0lICUtLS0tLSstLSstLTU1LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALcBEwMBEQACEQEDEQH/xAAbAAEAAwADAQAAAAAAAAAAAAAAAQUGAwQHAv/EAEIQAAICAQEFAwkEBQwDAAAAAAECAAMRBAUGEiExE0FRIlJhcYGRobHBIzJC0TRic4KDBxQVFjNDU3KSk7LwJETi/8QAGgEBAAIDAQAAAAAAAAAAAAAAAAQFAQMGAv/EAC0RAAICAQMEAAUEAgMAAAAAAAABAgMEBRESEyExQSIyUWGBFCMzcRU0QlKR/9oADAMBAAIRAxEAPwDvTijvhMAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQCIBMAQCIBMAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQCIBMAiAIBMAQBAEAQBAEATOzMOSXsTPF/Qxzj9RMbHrcQBMAQBAEAQBAEAQBAEAQBAEAQBAEAQBAIgEiAIAgCAIAgCAIAgCZSb7Iw5JLdl9svdW67DP9hX1y4y59S/nLKjTbLO8uxU5Gq119od2afRbqaesDiU3N3mw5Hu6S0r0+qHrcp7dRvm/OxbVaGtOS1VqPQiiS1VBeEQ3bN+WchoU8iqkf5RM9OP0Mc5fU6Wq2Hp7fv0158VUK3vE0zxap+UboZVsHupMz+0dyxzbT2EH/Ds5j2MOfzlfdpUX3gyzo1iS7WLcyut0NlDcFqFD3Z6H1HvlRbROp7SReUZNdy3izrzSbxAEAQBAEAQBAEAQBAEAQBAEAQBAEAiAIAgCAIBMAQBAOTT0NY61opd2OAomyuuVkuMUarro1R5SZvt392004FlmLL8dSMqnoUfWdFi4Malu+7OWzNQne9l2RoMSwK8QCj1u9enqsao8bFTglFBXPeM5kG3UKoS4sn1addbHkkcH9dNP5t3+hfzmv8AydJs/wATf9iw2RtuvVFxWtg4AOIsoA59B16yTRlQu+Ui5GLOjZTLSSSMdbX6Su1Clqqyd/F3ekHumq2uE4tTNlVk4STg+55ZrkrW2xaWLVBiEZupE5S+MYzaj4OxxpTlUnPycE0kkQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAJAmUt3seZNJbs9D3V2KNPWLHA7dxluX3F7lH1nS4GKqocn5OTz8t3T2XhF8BLAryYBS70bW/m1J4T9s+Vr9Hi3s/KQs3I6UO3km4OM77EvS8nmxOeZ5nvJ75zEpNvc7CMVFbIlELEKoyzEBQOpJ6CIxcnseZzUIuT9HqGwdmDTUJX+P71h8WPX8vZOrxaFVWl7OMyr3dY5MsZI8Ecxe+O3c50lR5dLmB6/qD6ym1DL/4Qf9l7peDu+rP8GQEpDoGhMGSYBEAQCYBEAQBAEAmARAEAQCYAgCAIBEAmAIAgCAIAgF9uds7ttR2jDNdOGPgX/CPhn2CWWm0c7OT8IqNWyHCtQXlnogE6Q5gmAcd9wRWdjhVBZie4CeZyUVuzMYuT4o8u21tE6m5rTyXpWvmr3e3vnK5d7usb9ejscLGVFaXv2dGRSYzUbk7L43OpceRXyrz3v3n2D5y40zG3l1JFFq+VsukvyboS+OeM7vZt3sE7Gs/buOv+Gvj6/CVudlqtcV5ZZafhO6XKXhGAJ985xtt7s6qMUlsj5mD0fSIWIVQWY8gB1M9Ri5PZHmc1FbsiYfYynutyJgyTAEAQBAEAQBAIgEwBAEAQBAIgEwBAEAQBAEAQD0TczS9npVb8VrFz6ug+AnTabVwpX3OR1O3qXv7F/LAryDAMXvvtbJ/miHphrSD7l+p9kpNSye/Tj+S90nE3/dkv6MlKQ6E+9NSbHSsYBZgMk4A9JnuuHOSiar7OnByPUNmrVTXXQjphQFHlLknx9ZM6ylwhFRTOMuc5yc5I703mkz+3dBo61s1N9fE7Hz34rG7gOcr8quiKc5on4luRJqut7Hn9rgsSFCAnIUEkKPDJnOTab3R1dcXGKUnuz5M8Gwvty9H2mq4yMrUhb948h8z7pZaZVyt3KjV7eNSj9TqbyaQU6q1ByUkOvqbn88zTnV8LXsb9Nt6lCb9FZIZYCABAIgEmAIAgEQCYAgEQCYAgCAIAgCAIAgCAIAMyjDeyPWNmVcFFKebUg+AnYUrauKOGulysk/udubTWVm39qDS0tZ1c+TWvix+g6+yRsq9UwbJOJju+xRR5jZYWJZjlmJLE95PWcrOTk92dlXBQioo+Z4PYmd9gy+3L0XaaoOR5NKl/3jyH190stNrcrOT9FPq9kYVcV5Zu9frUora2w8KqPaT3AemX1tsa4uUmc5VVKyShE802xtV9VYbH5KOSJnko/Ocxk5Mr5bs67CxI48fudGRSaIBvNxdJw6drT1tc4/yryHxzOj0yrhVyfs5XVbed3H6FXv8A14upfzqiv+lv/qQ9Wj8SZO0WXwyRl5UF4IAgCAIAgCAIAgAwBAEAQBAEAQBAEAQBAEAGZj5PMvDPXNG2a6yO9FPwE7GrvBHC2fMzldgASTgAZJPdPbaS7mEm+yPM949qnVXFgT2SZWsejvb2/lOYzcnqz7eEdZp2L0a935ZVSEWImAIBu906102jbUWEKLCXLHzRyX5Z9s6HBjGmnnI5XUZyvyOEfXYy+39sNq7M81qUns08B4n0yry8uV8vsXWDhRx47vyVkhFgIBKqSQBzJIAHiT0nqMW3sjxOajFtnrGztMKaq6h0RAs6+mHCCicRbZzm5fUyX8oLfaaceCWH4r+Up9XfxRRd6Ku0jJymL8QBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEyD0/drUdppKG7wgQ+tfJ+k6vDnzpTOKzK+F0l9ym312vwL/NUPlOM2nwTw9vykPUsrjHgifpWJzl1JeEYmUB0whLd7GJNJbssNrbLbTCni+9ZXxsPNOenuxJWRjdFR+5CxMvryl9Ezo1rkgE4BIBJ7vTI8F8S3Jdjai2vJZ7b2sbuGmvydNUAta+dgY4jJWTlOa4R8IgYWEq97J/MyuppZ2VEBZ2OFUdSZFrhKb2RNssjXHlJ9jk1+lNNhqYgsoXjx0DEZIHqyJ7ur6cuPs8Y13Vhz9HXmkkFvuppO11dWfu15sb93p8cSdp9fO1FbqlvChpe+x6ZOoOTPO99b+PVlR0qrVPbzY/MTm9Snyt2+h0+kV8aeX1ZQStLcQBAEAQBAEAQBAEAQBAEAQCIBMAQBAEAQBAEA0e7O3V01V6PzAHaVDxboV+Xxlrg5aqg4y/BS6hgyusjKK89mUGovax2tc5dySxlfbY7JuTLSipVQUEcc1G40W52yu2t7Zh9lUeWejP1Hu6+6Wmm43OXOXhFLquVwj04+X5LD+UCrlp38C6+8A/SSdWj2TI2iy+OSMbKI6M5dLp3tda61LOxwAPr4CbaqpWS4xRquujVHlLweg7D2KmjrNjENbwku/gOpA9E6LGxY0R39nKZWXPJml69Hn2qvNlllh6u7N7zmc5bPnNyOqoh064x+iOGazcbbcHSYS28/iYVr6hzPxPwl9pdW0XI5rWLt7FBejUazUCqt7G5Kilj7JaWT4RbKiuDnJRXs8m1V5sse1ursWPtM5K6znNyO2x6+nWonFNRuEAQBAEAQBAEAQBAEAmAIAgCAIAgCAIAgCAIAgCAculoa10qQZd2AA+v1myqt2SUUar7VVByZ6nsvRLp6kqToo5nzj3mdZRUq4KKOLutds3JlPv3VnShvMtU+/I+sh6pHencnaTLbIS+qMPo9I9zrVWpZ29wHifAShqplbLijpL74Ux5SPRNg7ETSpy8q1h5dmOvoHgJ0uLiRoj28nJZeXPIl38HHvdq+y0lmDhrMVj29fhmec+zhSz3p9XUvX27nm05Y7ETKW72MSe27PU9h6TsdPTV3hAW/zHmfiZ1uNX06kjicm3qWykZrffa/Ef5oh5AhrSPHuX6+6VmpZS/jiW2k4j36sl/RkpSHQiAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgGy3F2cMNqmwWOUQeaO8+sy90uhJc35Ob1fIk59NeEbAS5KUr9v6E6jTvSuAzcOCegwwP0mjJq6tbgb8a3pWKf0PnYux00qcKjLnHHYRzY/QeieMbGjTHZGcrJnkS3l4LISURzIb8rbY1NddVrooLsUrdl4jyHMDrgH3yn1SM5bRit0XOkyrg3KbSZlf6Ou/wL/wDZs/KU/wCnt/6v/wAL39XT/wB1/wCnd2Lsmx9RSr02onGGdnqdVAHPqR6Me2SMXGm7Vyi9iJmZtaqlxkmzX7y7cGmTgQg3sPJXzB5x+kuczLVMeK8lHhYTyJ7vwedsxJJJJJJJJOST4mc1JuT3Z1kIKK2j4Ink9iAIAgCAIAgCAIAgCAIAgCAIBEAmAIAgCAIAgCAIAgHc2ZtO3TPx1NjzlPNW9YkijJnS/hIuThwvjtLz9TabK3sptwtv2D/rc0J9DfnL3H1Gua+LszncjTLa38PdGgrtVhlSGB6EEESepJ+GVzTXk+sz0YJgEGAcGo1SVDisdUXxZgJrnZCC3kz3CEpvaKMvtjfBRlNMOI9O1YYUeod8q8jUopbVlti6TKT5W9l9DH3XM7F3YszHJY8yTKSc3N7yOhrqjXHjFdj4ng2CAIAgCAIAgCAIAgCAIAzAEAQBAEAQBAEAQBAEyBMATIEATAEIHNRqrK+ddj1n9ViJthdZD5WaJ49U/miixq3m1S/3xYfrIh+OMyStQuXsiS0rHfo5v626rz0/21nv/J3Hn/EUfc61+8Wqfkb2A8ECr8QMzXPPvl7NkdMx4/8AErbbGc8Tszt4sxY+8yLKycvLJkKoQ7RR8zwbBAEyNxMGRBgQBMgTAEAQBAEAQBAEAQBAEAiASIAgCAIB9VoWIVQSzEAAdST0nqMXJ7I8zmoJtmgs3QuVC5eocKliMtnkM46SyemWKPJsqFrNblskyl2fo3vsWqseU3j0A7yfRIVVMrJcUWN+RGmHORY7X3ds0tfau9bLxBcLxZyfZJF+DOmHJsiY2pwvnwSZz6XdK6xEsV6QrqGGWfOCM+bNkNMsnFSTRrs1euEnHi+xGs3Uuqre1nqK1qWIVnyQBnlyizTbIRcm12FWr1zmoqL7nDsrdy3U1i5GrVSSMOWByOvQTXRgTthyTNmRqcKZ8JJnYu3P1CgkGpyPwq7An1ZE2S0u1I1R1mpvZpooLayrFGBVlOCpGCDK+cHB7Mta7Izjyi+xYbH2NZq+PsyqhMZLkgZPcMD0SRjYsr/lImXnQx9lJeTj2vsqzSuqWFTxLxAoSQeeCOY/7mecjGlS1yPWLmRyE3H0fWx9kvq2dayilACeMkdfUDM42NK9tRMZebHHSck+5x7V2c2ms7JyrNwhsqSRg+v1TzkUSplxke8XKjkR5RR1aqi7BFBZicBQMkzVCDnLjE32WRhHlI0FG5+oYZY1VnzSxJHrwMSxjpdrW7KqWs1J7JNlftXYd2mHFYoKHlxoeJR6/CR78KynuyTjajVe9l2ZWqCSAASScADmSZFUW3sibKait2X+k3R1DgM3BVnudiW9oA5Swr0y2S3fYqrdYpi9o9zh2lu1qKFLkLYg5lqySQPSCMzxdp9ta38myjVabXt4KaQSzImATAEAQCIBMAiATAEAQCIBMAQBAEyDYblbH/8AbsHiKQfcW+gl3puJt+5I53Vczk+lD8mp2h/Y2/s3/wCJltam4Mpq3tNf2U+6Wx+wq7Rxi6wAnP4F7l/OQ8HF6Ud35Juflu+Wy8I+d+v0T+KnyM86p/CetJ/2Pwyx0JYaOooM2DTKUHi3Dy+Mk0t9FbediLdt13v43MxtHV7RNNotqC1FGFh4E5Ljn+KVd1mXwlyXYtaKsJTjxl3Lncn9DX9pZ85N07+Ahap/sM6ex95LLNUdNYqlWd1RlBDLjOM+PSacfOlK51y+ptyNPhChWxZW79UquoRxyL15b0kHAP8A3wkXVYbTTXsnaNNutp+i93cqXS6HtbOWVa5/HGOQ9wEscOHRoTZVZtjvyGkce+elFulW9eZrIcEd6NyP0PsmvUa1ZVzRt0u3pX8H77FZ/J9/a3/s1+ZkTSPnkTdb+WJ1d+P0v+En1mrVP5jfo38L/stdytCqUvrHxk8QUn8KL1PvB90l6dUoVuyRA1W6U7ekvBVa7e293JqIqrB8kcCsSP1ifpIt2pWOW8PBNo0ipQXPyd7Tb3I9Rr1VRYkFW7MDhcH0E8pvhqUJQ2sRGs0myFnKpjcrZyM9upwSqMUp4uq95J9OCB75nT6oycrPR51S+aUavt3OLbW9dnaNXpyERCRx8IZnI64zyAnjK1GanxrN2HpUJQ5Wezubt7ytc409/CWbPA4GOI+BHTpN2FnO18JkfP05UrnX4KXe3Zoo1GUGEtXjA7gc+UB8/bIGo0KuzdeGWOl5Dtr2l5RSSvLUQBAEAQBAEAQBAEAiASIAgCAWm7uyjqrQp/skw1h9HcvrP5ybhYzts+yK7UcpUw2Xlm227tRdJSqoB2jYSpe4dOePACX2RdGiKSOcx6JXyb/LLcDkJJXdEVlNtXa/Z6jT6VPv2WLxnzUz09ZkW7IUbIwXlkunGcq5WPwjr79/on8VPkZp1P8AhN+k/wCx+GWGhu7PRV2YzwaZXxnGcJmSapcaU/oiLdHle19zMbQ3wF1VtPYle0Rk4u0BxkYz0lZfqKlFw4ltTpbhNT5LsXW5H6Gv7Sz5yXpr/YIWqf7D/BY6fZtNTNbXWoc8RLAZY55mSo01w3kkQ5XWTSjJ9jEazUHaGtrUKVTIQA9QgOWJ9PX4Sksm8nISXhHQVV/o8Vt+WbPbWzjqKDQjisErkleLyRzx19AlxkUuyvgmUWPcq7OclufWj2fwaZdNY3aYrNZbGMjoOXqnuFO1XB/QxO7e3qLt7M5uRQatRqqm+8ihT7GMrdOhwtnEtNTsVlNcl7K/fg/+Z/CT6yLqne0laO0qX/Ze7vjttmNUn3uC6v8AeJJHzEsMX48XivJW5f7eZyfjdMwjqVJUghgcEEYIPhOenFxezOnhOM4px8HJVp3YZSt3AOMqjMM+ye1VOS3SPMr6ovZyNruM+dPbX0dbTxA8iMgdR7DLzTn+04HOaqtrlP0zG6/StTbZU4wysfaO4+2UuTB12NM6DFujZUmjv7raVrNXUVHk1t2jnzQOnvPKbtPrlK5NeCLqdsYUNPyyy3/uBtoQdVrYn94jH/GS9WknJIiaLFqMn9zLSnL4QBAEAQBAEAQBAEAiASIAgCZWz7Mw3stzc7G2ro9LSta25bHE54HyzHr3ToMe+imCSfc5bJx8m+xycTK7V2kdTebm5LxAIvmoDy/OVV+R1bU34LrHxejQ4ryza371aZUYrZxsF8lOFgWPcOYl09QqUd0+5QR06+U0mjF6LXZ1depub++Du2Ons8JS1X8r1ZIv7sbjjOuCL/e3bNF+n7OqzibtFbHCw5DPiPTLDOyarKuMWVmm4l1d3KSLHZu8GmWimt7VBWpVZSrHmAAR0kmnLpVaTZEvw73ZJqPs4NrbV0b6e9a2rNjVOExWQeLHLnieL78d1ySa3NmPjZKtjuntucO622qKdMtdtgR+NzjDdCeXdNeDk1108ZM26hi2zvcoxGwd5K1N1dz4QWu1LkE5UsTj/vjM42fDupP2ecnTrNoygvXc+dDqdHVq7tSL14XUcACtyYny+70D3mK50Qudm5myGVOlVOL7HU21vTabmGms4aQAAeBTxHvPlDPo9kj5OozU/wBt9iTh6XB172ruc27+9Ldoy6uzKFcq3ABwsO7yR35+E94moNyfVZ4zdMSSdKO7p9raVNZdeLl4LakB8lvvqSD3eGJvhkUxtck/JEljZEqVBx8M7z7e0THLWIx8TWSflJDysd+WjUsPJXiLM/TvCtGsvZPL0tjLyUYxhQOJRK5Z0a7m18pYy0+duPHf5kXVv9H6n7VmpZu8l+zb2jIPvk5/pbviexXr9VT8KTOvtPeKjT1GnS8LPgheAfZp6Se+ar8yqqHGs3Y+BddPlZ2X3MvsTazaa7tebq3KxSebDx9cqsbKdVnL6l1l4SurUV5Xg2T6vQ6xQbGqJHdYezdfR3GXSsxr1u9jnullY72Sf4OO/a+j0aFaeBm7kq55P6zTEsmiiPwnuGLkZM957/kw+u1bX2Na5yzHu6AdwHolBda7ZcmdNj0RpgoROvNJvEAQBAJgEQCYAgCAIBEAmAIAgCAIAmQJgCAJkCYAgCBsIAgCARMgmARMATI2JmARAJgbETIS2JmAIBEAmAIBEAmARAJgCAIBEAmAIAgCAIAgCAIAgCAIAgCAIAgEQBAEAQBAEAQBAEAQBAEAQBAEAQCYAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIBEAQBAEAQBAEAQBAEAQBAEAQBAEA//2Q=="
                />
              </defs>
            </svg>
          </div>
          <p class="label">MERALCO (Manila Electric Co.)</p>
        </div>
        <!--  -->
        <div class="biller-container">
          <div class="img-container">
            <ion-icon name="flash" class="icon"></ion-icon>
          </div>
          <p class="label">Example</p>
        </div>
        <!--  -->
        <div class="biller-container">
          <div class="img-container">
            <ion-icon name="flash" class="icon"></ion-icon>
          </div>
          <p class="label">Example</p>
        </div>
        <!--  -->
        <div class="biller-container">
          <div class="img-container">
            <ion-icon name="flash" class="icon"></ion-icon>
          </div>
          <p class="label">Example</p>
        </div>
      </div>
      <!--  -->
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonButton,
  IonCol,
  IonGrid,
  IonRow,
  IonIcon,
  IonInput,
  IonCheckbox,
  IonCard,
  IonContent,
  IonPage,
} from "@ionic/vue";
import { defineComponent } from "vue";
import HeaderReturn from "@/components/header/HeaderReturn.vue";
import Refresher from "@/components/refresher/Refresher.vue";

export default defineComponent({
  components: {
    IonButton,
    IonCol,
    IonGrid,
    IonRow,
    IonIcon,
    IonInput,
    IonCheckbox,
    IonCard,
    IonContent,
    IonPage,
    HeaderReturn,
    Refresher,
  },

  data() {
    return {
      headerTitle: "Electricity",
      loading: true,
      theme: {},
    };
  },

  created() {
    this.fetchTheme();
    this.loading = false;
  },

  methods: {
    navigateToValeMain() {
      this.$router.go(-1);
    },
    navigateRequestForm() {},
    addFavorites() {},
    async navigatePayment() {
      this.$router.push("/paybill");
    },

    fetchTheme() {
      const themeData = JSON.parse(localStorage.getItem("themeData")) || {};
      this.theme = themeData;
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
.bills-page {
  margin: 0;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  border-radius: 0;
  overflow-y: scroll;
}
.return-container {
  margin: 0;
}

.bills-title h4 {
  font-family: Poppins;
  font-size: 20px;
  font-weight: 700;
  margin: 20px 0 10px 10px;
}
.bill-contents {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  margin: 10px 10px 5px 0;
  overflow: scroll;
}
.bill-contents h5 {
  font-family: Poppins;
  font-size: 25px;
  color: white;
  font-weight: 700;
}
.bill-categories {
  /* flex-wrap: wrap; */
  background-color: white;
  border-radius: 10px;
  margin: 50px auto 0 auto;
  display: flex;
  width: 90%;
  max-width: 500px;
  padding: 10px 10px 30px 10px;
  height: fit-content;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.bill-categories h1 {
  font-family: Poppins;
  font-size: 12px;
  font-weight: 700;
  color: #018593;
}
.fave-billers {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  background-color: #62a0ae;
  border: 1px solid white;
  border-radius: 10px;
  margin: 10px 0 10px 20px;
  min-width: 320px;
  max-width: 500px;
  height: 10%;
  padding: 15px;
}
.fave-billers h1 {
  font-family: Poppins;
  font-size: 12px;
  font-weight: 500;
  color: white;
  margin: 0 10px 1px 0;
}
.return-btn {
  border-radius: 100px;
  overflow: hidden;
  position: absolute;
  top: 10px;
  left: 10px;
  right: 0;
  margin: 20px 0 0 5px;
  width: 70%;
  height: 30px;
  max-width: 48px;
}
.back-icon {
  font-size: 20px;
  color: #018593;
}
.add-btn {
  margin: 5px 0 5px 10px;
  position: relative;
  border-radius: 10px;
}
.add-icon {
  font-size: 20px;
  color: #018593;
}
.search-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  /* height: 30px; */
  min-width: 320px;
  max-width: 500px;
  padding: 15px;
}
.search-bar {
  font-family: Poppins;
  font-size: 12px;
  padding: 10px;
  border-radius: 10px;
  color: #9e9e9e;
  font-weight: 600;
  border: none;
  --border-width: 0;
  --padding-start: 10px;
  --padding-end: 10px;
  background-color: #f3f3f3;
  box-shadow: inset 0 -4px 8px rgba(0, 0, 0, 0.1);
}
.search-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 90%;
  color: #9e9e9e;
  font-size: 15px;
}
.suggest-btn {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 350px;
  margin: 50px 0 0 0;
  text-transform: none;
  font-family: Poppins;
  color: white;
  font-weight: 600;
  font-size: 13px;
  background-color: #018593;
  transform: translateX(-50%);
}
.category-buttons {
  margin: 0 5px 0 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.btn-text h4 {
  padding: 0;
  margin: 0;
  font-family: Poppins;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  color: white;
}
.btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 10px;
}
.categories-btn {
  font-size: 25px;
  color: var(--ion-color-blue-theme);
}
.card {
  padding: 0;
  height: 70px;
  width: fit-content;
  min-width: 90px;
  border-radius: 10px;
  margin: 10px 5px 0 5px;
  /* box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.8); */
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.create-vale-btn {
  border-radius: 10px;
  overflow: hidden;
  position: fixed;
  bottom: 5%;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 80%;
  height: 30px;
  max-width: 350px;
}
.biller-categories {
  display: flex;
  flex-direction: column;
  padding: 10px 20px 0 20px;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.biller-container {
  display: flex;
  align-items: center;
  flex-direction: row;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  width: 100%;
  max-width: 320px;
  border-radius: 10px;
  padding: 10px;
}
.img-container {
  height: 50px;
  width: 50px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.img-container .icon {
  font-size: 24px;
}
.label {
  font-size: 16px;
  font-weight: bold;
  margin-left: 10px;
}

@media screen and (max-height: 600px) {
  .suggest-btn {
    bottom: 0;
  }
}
</style>
