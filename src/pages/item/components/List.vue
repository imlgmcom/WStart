<template>
  <div
    class="item-list w-full min-h-[20px]"
    :style="{
      fontSize: store.setting.item.fontSize + 'px',
    }"
    :class="[
      `${getLayout(classificationId) === 'list' ? 'flex flex-wrap gap-[16px] px-2 py-1' : 'flex flex-wrap pb-4 gap-[16px] px-2'}`
    ]"
    :classification-id="classificationId"
    @mouseover="mouseover"
    @mouseout="mouseout"
    @click="runItem($event, false)"
    @dblclick="runItem($event, true)"
  >
    <div
      v-for="(item, index) of itemList"
      :draggable="true"
      class="transition-all duration-200"
      :class="[
        `${getLayout(classificationId) === 'list' ? 'list-item flex items-center rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 item' : ''}`,
        `${getLayout(classificationId) === 'cover' ? 'cover-card flex flex-col rounded-lg overflow-hidden border relative hover:shadow-xl hover:translate-y-[-4px] item' : ''}`,
        `${getLayout(classificationId) === 'cover' ? 'h-full' : ''}`,
        `${getLayout(classificationId) === 'tile' ? 'item py-2 hover:shadow-xl hover:translate-y-[-4px]' : ''}`,
        `${getLayout(classificationId) === 'cover' && store.setting.item.hideItemName ? 'h-[150px]' : ''}`,
      ]"
      :item-id="item.id"
      :id="'item-' + item.id"
      :key="'item-' + item.id + '-' + index"
      :style="{
        backgroundColor: store.itemBatchOperationDataArray.includes(item.id)
          ? hexToRGBA(store.setting.appearance.theme.secondBackgroundColor, 0.4)
          : getLayout(classificationId) === 'cover'
          ? store.setting.appearance.theme.mainBackgroundColor
          : undefined,
        height:
          getLayout(classificationId) === 'tile' ||
          !store.setting.item.hideItemName
            ? 'auto'
            : getIconSize(classificationId) + 'px',
        // 为封面布局添加边框样式
        borderWidth: getLayout(classificationId) === 'cover' ? '1px' : undefined,
        borderColor: getLayout(classificationId) === 'cover' ? store.setting.appearance.theme.borderColor : undefined,
        borderStyle: getLayout(classificationId) === 'cover' ? 'solid' : undefined,
      }"
      :title="getItemTitle(item)"
    >
      <!-- Cover layout card -->
      <template v-if="getLayout(classificationId) === 'cover'">
        <!-- Background image -->
        <div 
          class="cover-card-bg w-full" 
          :style="{
            backgroundImage: (item.data.localBackgroundImage || item.data.backgroundImage) ? `url('${convertLocalPathToFileUrl(item.data.localBackgroundImage || item.data.backgroundImage)}')` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: store.setting.item.hideItemName ? '100%' : '150px',
            backgroundColor: !item.data.localBackgroundImage && !item.data.backgroundImage ? store.setting.appearance.theme.mainBackgroundColor : undefined,
          }"
        >
          <!-- Icon container -->
          <div class="cover-card-icon-container flex justify-center items-center h-full">
            <ItemIcon :classification-id="classificationId" :item="item"></ItemIcon>
          </div>
        </div>
        <!-- Item name -->
        <div 
          v-if="!store.setting.item.hideItemName" 
          class="cover-card-name p-3 text-center truncate text-sm"
          :style="{
            color: store.setting.appearance.titleColor,
          }"
        >
          <template
            v-if="item.name"
            v-for="(text, tIndex) of item.name.split('\n')"
          >
            {{ text }}
            <br
              v-if="
                item.name.split('\n').length > 1 &&
                tIndex < item.name.split('\n').length - 1
              "
            />
          </template>
        </div>
      </template>
      
      <!-- List layout -->
      <template v-else-if="getLayout(classificationId) === 'list'">
        <ItemIcon :classification-id="classificationId" :item="item" class="mr-3"></ItemIcon>
        <p
          class="truncate flex-1"
          :class="[
            `${store.setting.item.hideEllipsis
              ? 'item-name-list-no-ellipsis'
              : 'item-name-list'}`
          ]"
          :style="{
            color: store.setting.appearance.titleColor,
            filter: store.setting.appearance.fontShadow
              ? 'drop-shadow(1px 1px 1px ' +
                store.setting.appearance.fontShadowColor +
                ')' : undefined,
            fontWeight: store.setting.item.fontWeight,
            lineHeight: store.setting.item.fontLineHeight + 'rem',
            maxHeight:
              store.setting.item.hideEllipsis
                ? store.setting.item.fontLineHeight * 1 + 'rem'
                : undefined,
            margin: 0, // 重置margin，确保水平排列
          }"
          v-if="!store.setting.item.hideItemName"
        >
          <template
            v-if="item.name"
            v-for="(text, tIndex) of item.name.split('\n')"
          >
            {{ text }}
            <br
              v-if="
                item.name.split('\n').length > 1 &&
                tIndex < item.name.split('\n').length - 1
              "
            />
          </template>
        </p>
      </template>
      
      <!-- Tile layout -->
      <template v-else>
        <div :class="[`${getLayout(classificationId) === 'cover' ? 'app-store-card-content' : ''}`]">
          <ItemIcon :classification-id="classificationId" :item="item"></ItemIcon>
          <p
            class="mx-2 truncate"
            :class="[
              `${getLayout(classificationId) === 'tile' ? 'mt-2 text-center' : ''}`,
              `${getLayout(classificationId) === 'cover' ? 'app-store-card-title' : ''}`,
              `${
                store.setting.item.itemNameRowCount === 2
                  ? store.setting.item.hideEllipsis
                    ? 'item-name-tile-2-no-ellipsis'
                    : 'item-name-tile-2'
                  : store.setting.item.hideEllipsis
                  ? 'item-name-tile-1-no-ellipsis'
                  : 'item-name-tile-1'
              }`,
            ]"
            :style="{
              color: store.setting.appearance.titleColor,
              filter: store.setting.appearance.fontShadow
                ? 'drop-shadow(1px 1px 1px ' +
                  store.setting.appearance.fontShadowColor +
                  ')' : undefined,
              fontWeight: store.setting.item.fontWeight,
              lineHeight: store.setting.item.fontLineHeight + 'rem',
              maxHeight:
                store.setting.item.itemNameRowCount === 2
                  ? store.setting.item.hideEllipsis
                    ? store.setting.item.fontLineHeight * 2 + 'rem'
                    : undefined
                  : store.setting.item.hideEllipsis
                  ? store.setting.item.fontLineHeight * 1 + 'rem'
                  : undefined,
            }"
            v-if="!store.setting.item.hideItemName"
          >
            <template
              v-if="item.name"
              v-for="(text, tIndex) of item.name.split('\n')"
            >
              {{ text }}
              <br
                v-if="
                  item.name.split('\n').length > 1 &&
                  tIndex < item.name.split('\n').length - 1
                "
              />
            </template>
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { Item } from "../../../../types/item";
import { getClassElement, hexToRGBA } from "../../../utils/style";
import ItemIcon from "../../../components/ItemIcon.vue";
import {
  getItemById,
  run,
  showItemList,
  itemHoverStyle,
  itemRemoveStyle,
  getLayout,
  getIconSize,
  setItemWidth,
  getItemTitle,
} from "../../item/js/index";
import { getClassificationById } from "../../classification/js/index";
import { Classification } from "../../../../types/classification";
import { useMainStore } from "../../../store";
// pinia
const store = useMainStore();

/**
 * 将本地文件路径转换为file:// URL
 * @param path 本地文件路径
 * @returns file:// URL
 */
function convertLocalPathToFileUrl(path: string): string {
  if (!path) return path;
  
  // 处理Windows盘符，将 C:\... 转换为 file:///C:/...
  let url = path.replace(/^([a-zA-Z]):\\/, (match, drive) => {
    return `file:///${drive}:/`;
  });
  
  // 将所有反斜杠转换为斜杠
  url = url.replace(/\\/g, '/');
  
  return url;
}
// props
const props = defineProps<{
  classificationId: number | null;
  data: {
    id: number | null;
    resultList: Array<Item>;
  };
}>();
// 排序
let sort = "default";
// 布局
let layout = "default";
// 列数
let columnNumber: number | null = null;
// 显示
let showOnly = "default";
// 当前分类ID
let classificationId = ref(props.classificationId);
let classification = ref<Classification | null>(null);
if (classificationId.value) {
  // 查询分类
  classification.value = getClassificationById(classificationId.value);
  sort = classification.value ? classification.value.data.itemSort : "default";
  layout = classification.value
    ? classification.value.data.itemLayout
    : "default";
  columnNumber = classification.value
    ? classification.value.data.itemColumnNumber
    : null;
  showOnly = classification.value
    ? classification.value.data.itemShowOnly
    : "default";
}
// 分类列表
let itemList = ref<Array<Item>>(
  showItemList(props.data.resultList, classification.value)
);
// 监听
watch(
  () => props.classificationId,
  (newValue: number | null) => {
    // 新数据
    classificationId.value = newValue;
    if (newValue) {
      // 查询分类
      classification.value = getClassificationById(newValue);
      sort = classification.value
        ? classification.value.data.itemSort
        : "default";
      layout = classification.value
        ? classification.value.data.itemLayout
        : "default";
      columnNumber = classification.value
        ? classification.value.data.itemColumnNumber
        : null;
      showOnly = classification.value
        ? classification.value.data.itemShowOnly
        : "default";
    }
    itemList.value = showItemList(props.data.resultList, classification.value);
  }
);
// 监听数据
watch(
  () => props.data,
  (newValue: { id: number | null; resultList: Array<Item> }) => {
    if (
      classification.value &&
      newValue.id &&
      newValue.id === classification.value.id
    ) {
      // 新数据
      itemList.value = showItemList(newValue.resultList, classification.value);
    }
  },
  { deep: true }
);
// 监听分类
watch(
  () => classification.value,
  (newValue: Classification | null) => {
    if (newValue) {
      if (sort !== newValue.data.itemSort) {
        // 重新加载列表
        itemList.value = showItemList(props.data.resultList, newValue);
        sort = newValue.data.itemSort;
      } else if (layout !== newValue.data.itemLayout) {
        layout = newValue.data.itemLayout;
      } else if (columnNumber !== newValue.data.itemColumnNumber) {
        columnNumber = newValue.data.itemColumnNumber;
      } else if (showOnly !== newValue.data.itemShowOnly) {
        // 重新加载列表
        itemList.value = showItemList(props.data.resultList, newValue);
        showOnly = newValue.data.itemShowOnly;
      }
      // 刷新DOM完毕执行
      nextTick(() => {
        // 设置项目宽度
        setItemWidth();
      });
    }
  },
  { deep: true }
);
// 监听显示列表
watch(
  () => itemList.value,
  () => {
    // 刷新DOM完毕执行
    nextTick(() => {
      // 设置项目宽度
      setItemWidth();
    });
  }
);
// 运行项目
function runItem(e: any, dbclick: boolean) {
  if (!store.itemSorting && !store.itemBatchOperation) {
    // 找到item
    let itemElement = getClassElement(e, "item");
    if (itemElement) {
      // 项目ID
      let itemId = parseInt(itemElement.getAttribute("item-id"));
      // 查询项目
      let item = getItemById(itemId);
      if (item && item.data) {
        if (dbclick && store.setting.item.doubleClickOpen) {
          run("main", "open", item);
        } else if (!dbclick && !store.setting.item.doubleClickOpen) {
          run("main", "open", item);
        }
      }
    }
  }
}
// mouseover
function mouseover(e: any) {
  // 鼠标经过添加样式
  if (
    getClassElement(e, "item") &&
    !store.itemSorting &&
    !store.itemBatchOperation &&
    !store.itemRightMenuItemId &&
    !store.itemDragOut
  ) {
    itemHoverStyle(e, "item");
  }
}
// mouseout
function mouseout(e: any) {
  // 鼠标移走删除样式
  if (
    getClassElement(e, "item") &&
    !store.itemSorting &&
    !store.itemBatchOperation &&
    !store.itemRightMenuItemId &&
    !store.itemDragOut
  ) {
    itemRemoveStyle(e, "item");
  }
}
</script>
../../classification/js/classification../js/item
../../../../types/item../../../../types/classification
