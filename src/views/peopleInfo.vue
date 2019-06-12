<template>
  <div class="info">
    <div class="box basicInfo">
      <div class="title">
        <span>基本信息</span>
      </div>
      <div class="content">
        <div class="row row1">
          <div class="col">
            <div class="tabTitle">
              <span>姓名</span>
            </div>
            <span class="value" :class="{'noData': peopleInfo.basicInfo.name === ''}">{{peopleInfo.basicInfo.name|noDataFormat}}</span>
          </div>
          <div class="col">
            <div class="tabTitle">
              <span>性别</span>
            </div>
            <span class="value" :class="{'noData': peopleInfo.basicInfo.gender === ''}">{{peopleInfo.basicInfo.gender|noDataFormat}}</span>
          </div>
          <div class="col">
            <div class="tabTitle">
              <span>出生年月</span>
            </div>
            <span class="value" :class="{'noData': peopleInfo.basicInfo.birthday === ''}">{{peopleInfo.basicInfo.birthday|noDataFormat}}</span>
          </div>
          <div class="col">
            <div class="tabTitle">
              <span>民族</span>
            </div>
            <span class="value" :class="{'noData': peopleInfo.basicInfo.nation === ''}">{{peopleInfo.basicInfo.nation|noDataFormat}}</span>
          </div>
        </div>
        <div class="row row2">
          <div class="col">
            <div class="tabTitle">
              <span>籍贯</span>
            </div>
            <span class="value" :class="{'noData': peopleInfo.basicInfo.birthPlace === ''}">{{peopleInfo.basicInfo.birthPlace|noDataFormat}}</span>
          </div>
          <div class="col">
            <div class="tabTitle">
              <span>政治面貌</span>
            </div>
            <span class="value" :class="{'noData': peopleInfo.basicInfo.politicalOutlook === ''}">{{peopleInfo.basicInfo.politicalOutlook|noDataFormat}}</span>
          </div>
          <div class="col" style="flex:2">
            <div class="tabTitle">
              <span>身份证</span>
            </div>
            <span class="value" :class="{'noData': peopleInfo.basicInfo.idNumber === ''}">{{peopleInfo.basicInfo.idNumber|IdFormat}}</span>
          </div>
        </div>
        <div class="row row3">
          <div class="col">
            <div class="tabTitle">
              <span>文化程度</span>
            </div>
            <span class="value" :class="{'noData': peopleInfo.basicInfo.education === ''}">{{peopleInfo.basicInfo.education|noDataFormat}}</span>
          </div>
          <div class="col">
            <div class="tabTitle">
              <span>户籍地</span>
            </div>
            <span class="value" :class="{'noData': peopleInfo.basicInfo.houseRegisterAddress === ''}">{{peopleInfo.basicInfo.houseRegisterAddress|noDataFormat}}</span>
          </div>
          <div class="col" style="flex:2">
            <div class="tabTitle">
              <span>户籍地址</span>
            </div>
            <span class="value" :class="{'noData': peopleInfo.basicInfo.houseRegisterLocation === ''}">{{peopleInfo.basicInfo.houseRegisterLocation|noDataFormat}}</span>
          </div>
        </div>
        <div class="row row4">
          <div class="col">
            <div class="tabTitle">
              <span>居住地</span>
            </div>
            <span class="value" :class="{'noData': peopleInfo.basicInfo.homeAddress === ''}">{{peopleInfo.basicInfo.homeAddress|noDataFormat}}</span>
          </div>
          <div class="col">
            <div class="tabTitle">
              <span>居住地址</span>
            </div>
            <span class="value" :class="{'noData': peopleInfo.basicInfo.homeLocation === ''}">{{peopleInfo.basicInfo.homeLocation|noDataFormat}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="box contactInfo">
      <div class="title">
        <span>联系信息</span>
      </div>
      <div class="content">
        <div class="row row1">
          <div class="col">
            <div class="tabTitle">
              <span class="">手机号码</span>
            </div>
            <span class="value" :class="{'noData': peopleInfo.contactInfo.mobile === ''}">{{peopleInfo.contactInfo.mobile|noDataFormat}}</span>
          </div>
          <div class="col">
            <div class="tabTitle">
              <span>联系电话</span>
            </div>
            <span class="value" :class="{'noData': peopleInfo.contactInfo.phone === ''}">{{peopleInfo.contactInfo.phone|noDataFormat}}</span>
          </div>
          <div class="col">
            <div class="tabTitle">
              <span>QQ号码</span>
            </div>
            <span class="value" :class="{'noData': peopleInfo.contactInfo.QQ === ''}">{{peopleInfo.contactInfo.QQ|noDataFormat}}</span>
          </div>
          <div class="col">
            <div class="tabTitle">
              <span>微信号码</span>
            </div>
            <span class="value" :class="{'noData': peopleInfo.contactInfo.weChat === ''}">{{peopleInfo.contactInfo.weChat|noDataFormat}}</span>
          </div>
        </div>
        <div class="row row2">
          <div class="col">
            <div class="tabTitle">
              <span>邮箱</span>
            </div>
            <span class="value" :class="{'noData': peopleInfo.contactInfo.email === ''}">{{peopleInfo.contactInfo.email|noDataFormat}}</span>
          </div>
          <div class="col">
            <div class="tabTitle">
              <span>个人网站</span>
            </div>
            <span class="value" :class="{'noData': peopleInfo.contactInfo.website === ''}">{{peopleInfo.contactInfo.website|noDataFormat}}</span>
          </div>
        </div>
        <div class="row row3">
          <div class="col">
            <div class="tabTitle">
              <span>紧急联系人</span>
            </div>
            <span class="value" :class="{'noData': peopleInfo.contactInfo.emerContactPerson === ''}">{{peopleInfo.contactInfo.emerContactPerson|noDataFormat}}</span>
          </div>
          <div class="col">
            <div class="tabTitle">
              <span>紧急联系人电话</span>
            </div>
            <span class="value" :class="{'noData': peopleInfo.contactInfo.emerContactPhone === ''}">{{peopleInfo.contactInfo.emerContactPhone|noDataFormat}}</span>
          </div>
          <div class="col" style="flex:2">
            <div class="tabTitle">
              <span>传真</span>
            </div>
            <span class="value" :class="{'noData': peopleInfo.contactInfo.fax === ''}">{{peopleInfo.contactInfo.fax|noDataFormat}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="box socialHistory">
      <div class="title">
        <span>社会履历</span>
      </div>
      <div class="content">
        <div class="tableTitle">
          <span>学历记录</span>
        </div>
        <el-table
        empty-text="暂无数据"
        :data="peopleInfo.socialHistory.eduHistory"
        style="width: 100%">
          <el-table-column
            prop="university"
            label="毕业院校"
            width="180">
          </el-table-column>
          <el-table-column
            prop="joinTime"
            label="入校时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="graduatedTime"
            label="毕业时间">
          </el-table-column>
          <el-table-column
            prop="education"
            label="学历">
          </el-table-column>
          <el-table-column
            prop="major"
            label="专业">
          </el-table-column>
        </el-table>
        <div class="tableTitle">
          <span>就业简历</span>
        </div>
        <el-table
        empty-text="暂无数据"
        :data="peopleInfo.socialHistory.jobHistory"
        style="width: 100%">
          <el-table-column
            prop="workPlace"
            label="工作单位"
            width="180">
          </el-table-column>
          <el-table-column
            prop="entryTime"
            label="入职时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="quitTime"
            label="离职时间">
          </el-table-column>
          <el-table-column
            prop="position"
            label="工作职位">
          </el-table-column>
        </el-table>
      </div>

    </div>
    <div class="box certificate">
      <div class="title">
        <span>获得证书</span>
      </div>
      <div class="content">
        <div class="tableTitle">
          <span>职业资格证</span>
        </div>
        <el-table
        empty-text="暂无数据"
        :data="peopleInfo.certificate.qualifiCertificate"
        style="width: 100%">
          <el-table-column
            prop="type"
            label="资格证类别"
            width="180">
          </el-table-column>
          <el-table-column
            prop="number"
            label="资格证号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="acquireWay"
            label="取得方式">
          </el-table-column>
          <el-table-column
            prop="acquireDate"
            label="取得日期">
          </el-table-column>
          <el-table-column
            prop="acquireAddress"
            label="取得地">
          </el-table-column>
        </el-table>
        <div class="tableTitle">
          <span>职称</span>
        </div>
        <el-table
        empty-text="暂无数据"
        :data="peopleInfo.certificate.academicTitle"
        style="width: 100%">
          <el-table-column
            prop="title"
            label="职称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="awardOrg"
            label="颁发机构"
            width="180">
          </el-table-column>
          <el-table-column
            prop="awardData"
            label="颁发日期">
          </el-table-column>
          <el-table-column
            prop="getTitleTime"
            label="获得职称时间">
          </el-table-column>
          <el-table-column
            prop="acquireAddress"
            label="取得地">
          </el-table-column>
        </el-table>
        <div class="tableTitle">
          <span>执业证</span>
        </div>
        <el-table
        empty-text="暂无数据"
        :data="peopleInfo.certificate.practCertificate"
        style="width: 100%">
          <el-table-column
            prop="number"
            label="执业证号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="type"
            label="执业类型"
            width="180">
          </el-table-column>
          <el-table-column
            prop="status"
            label="执业状态">
          </el-table-column>
          <el-table-column
            prop="issuingDate"
            label="发证时间">
          </el-table-column>
          <el-table-column
            prop="years"
            label="执业年限">
          </el-table-column>
        </el-table>
      </div>

    </div>
    <div class="box commend">
      <div class="title">
        <span>获得表彰</span>
      </div>
      <div class="content">
        <el-table
        empty-text="暂无数据"
        :data="peopleInfo.commend"
        style="width: 100%">
          <el-table-column
            prop="commendName"
            label="表彰名称"
          >
          </el-table-column>
          <el-table-column
            prop="commendDate"
            label="表彰时间"
          >
          </el-table-column>
          <el-table-column
            prop="commendUnit"
            label="授予单位">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="box archivesInfo">
      <div class="title">
        <span>档案信息</span>
      </div>
      <div class="content">
        <el-table
        empty-text="暂无数据"
        :data="peopleInfo.archivesInfo"
        style="width: 100%">
          <el-table-column
            prop="archivesNumber"
            label="档案编号"
          >
          </el-table-column>
          <el-table-column
            prop="archivesOrg"
            label="档案从放单位"
          >
          </el-table-column>
          <el-table-column
            prop="archivesLocation"
            label="档案从放地">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { getPeopleInfo } from '@/api/api.js'
export default {
  name: 'info',
  data () {
    return {
      peopleInfo: {}
    }
  },
  filters: {
    noDataFormat (val) {
      return val === '' ? '暂无' : val
    },
    IdFormat (val) {
      return val === '' ? '暂无' : val.substring(0, 6) + '********' + val.substring(14, 18)
    }
  },
  mounted () {
    console.log(window.localStorage)
    console.log(this.$route.params.people)
    getPeopleInfo({ g_id: this.$route.params.people }).then((res) => {
      this.peopleInfo = res.data
    })
  }
}
</script>

<style scoped lang="less" >
@import '~@/assets/css/peopleInfo.less';
</style>

<style lang="less">
.el-table {
  border: 1px solid rgba(231,231,231,1);
  border-radius: 2px;
  .has-gutter {
    color: rgba(102,102,102,1);
     tr, th {
       background:rgba(245,245,245,1);
     }
  }
  .el-table__row {
    td {
      color: #4D4B4B;
    }
  }
}
</style>
