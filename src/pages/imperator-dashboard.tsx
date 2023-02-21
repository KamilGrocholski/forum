import { type NextPage } from "next"
import CreateCategoryForm from "../components/common/Forms/CreateCategoryForm"
import CreateSubCategoryForm from "../components/common/Forms/CreateSubCategoryForm"
import StateWrapper from "../components/common/StateWrapper"
import MainLayout from "../components/layout/MainLayout"
import { api } from "../utils/api"

const ImperatorDashboard: NextPage = () => {
    const categoriesWithSubCategories = api.category.getAllWithSubCategories.useQuery()

    return (
        <MainLayout>
            <CreateCategoryForm />
            <StateWrapper
                data={categoriesWithSubCategories.data}
                isLoading={categoriesWithSubCategories.isLoading}
                isError={categoriesWithSubCategories.isError}
                NonEmpty={(categories) => (
                    <div>
                        {categories.map((category) => (
                            <div key={category.id}>
                                {category.name}
                                <CreateSubCategoryForm categoryId={category.id} />
                                {category.subCategories.map((subCategory) => (
                                    <div key={subCategory.id}>{subCategory.name}</div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            />
        </MainLayout>
    )
}

export default ImperatorDashboard