import { shallowMount } from "@vue/test-utils";
import FormSelectList from "../../src/components/FormSelectList.vue";

describe("FormSelectList data object options", () => {
  const $t = () => {};
  const dataObjectOptions = {
    allowMultiSelect: true,
    dataName: "albumData",
    dataSource: "dataObject",
    key: "id",
    renderAs: "dropdown",
    value: "title",
    valueTypeReturned: "single"
  };

  const nextTicks = async (wrapper) => {
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
  };

  const factory = (propsData, getScreenData) =>
    shallowMount(FormSelectList, {
      mocks: { $t },
      propsData: {
        name: "informationObtained",
        ...propsData
      },
      methods: {
        makeProxyData: getScreenData
      }
    });

  it("keeps draft values while data object options are pending", async () => {
    const wrapper = factory(
      {
        value: ["2", "3"],
        options: dataObjectOptions
      },
      () => ({ albumData: null })
    );

    await nextTicks(wrapper);

    expect(wrapper.vm.dataObjectOptionsPending).toBe(true);
    expect(wrapper.vm.selectListOptions).toEqual([]);
    expect(wrapper.vm.valueProxy).toEqual(["2", "3"]);
    expect(wrapper.emitted().reset).toBeUndefined();
    expect(wrapper.emitted().input).toBeUndefined();
  });

  it("resolves preserved draft values after data object options load", async () => {
    const screenData = { albumData: null };
    const wrapper = factory(
      {
        value: ["2", "3"],
        options: dataObjectOptions
      },
      () => screenData
    );

    await nextTicks(wrapper);

    screenData.albumData = [
      { id: "2", title: "sunt qui excepturi placeat culpa" },
      { id: "3", title: "omnis laborum odio" }
    ];
    await wrapper.vm.fillSelectListOptions(true);
    await nextTicks(wrapper);

    expect(wrapper.vm.dataObjectOptionsPending).toBe(false);
    expect(wrapper.vm.selectListOptions).toHaveLength(2);
    expect(wrapper.vm.valueProxy).toEqual(["2", "3"]);
    expect(wrapper.emitted().reset).toBeUndefined();
  });

  it("resets invalid values once data object options are available", async () => {
    const wrapper = factory(
      {
        value: ["999"],
        options: dataObjectOptions
      },
      () => ({
        albumData: [
          { id: "2", title: "sunt qui excepturi placeat culpa" },
          { id: "3", title: "omnis laborum odio" }
        ]
      })
    );

    await nextTicks(wrapper);

    expect(wrapper.vm.dataObjectOptionsPending).toBe(false);
    expect(wrapper.emitted().reset).toEqual([["informationObtained"]]);
  });
});
